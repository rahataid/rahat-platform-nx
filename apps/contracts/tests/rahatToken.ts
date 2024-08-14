import {
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { RahatAccessManager, RahatToken } from "../typechain-types";
import { getFunctionId } from "./helpers";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//lists of tests to do
//1. Deployment Verification - verify constructor arguments and Check initial states of the contract
//2. Test Public functions and monitor state changes
//3. Test Restrcited functions with access controls
//4. Test Getters
//5. Test Events triggers on state changes

interface Fixture {
    rahatToken: RahatToken;
    rahatAccessManager: RahatAccessManager;
    deployer: any;
    owner: any;
    manager: any;
    minter: any;
}

describe('------ Rahat Token Tests ------', function () {
    const deployRahatTokenFixture = async function (): Promise<Fixture> {
        //@ts-ignore
        const [deployer, owner, manager, minter] = await hre.ethers.getSigners();
        const rahatAccessManager: RahatAccessManager = await hre.ethers.deployContract("RahatAccessManager", [owner.address]);
        const rahatToken: RahatToken = await hre.ethers.deployContract("RahatToken", ['Rahat', 'RTH', "token description", 0, 0, owner.address, rahatAccessManager.target, rahatAccessManager.target]);
        return {
            rahatToken,
            rahatAccessManager,
            deployer,
            owner,
            manager,
            minter,
        };
    }

    describe("Deployment", function () {
        let rahatToken: RahatToken;
        let rahatAccessManager: RahatAccessManager;
        let owner: any;
        let manager: any;
        let deployer: any;

        before(async function () {
            const fixtures = await loadFixture(deployRahatTokenFixture);
            rahatToken = fixtures.rahatToken;
            rahatAccessManager = fixtures.rahatAccessManager;
            owner = fixtures.owner;
            manager = fixtures.manager;
            deployer = fixtures.deployer;

        });
        it("should deploy contracts with expected initial values", async function () {
            expect(await rahatToken.name()).to.equal('Rahat');
            expect(await rahatToken.symbol()).to.equal('RTH');
            expect(await rahatToken.decimals()).to.equal(0n);
            expect(await rahatToken.totalSupply()).to.equal(0n);
            expect(await rahatToken.authority()).to.equal(rahatAccessManager.target);

        });
        it('should set manager', async function () {
            const functionSignature = rahatToken.interface.getFunction('mint').format();
            const mintId = getFunctionId(functionSignature);

            //set mint function to require manager role
            await rahatAccessManager.connect(owner).setTargetFunctionRole(rahatToken.target, [mintId], 1);

            //grant manager role to manager
            await rahatAccessManager.connect(owner).grantRole(1, manager.address, 0);

            //check if manager has access to mint function
            const canCall = await rahatAccessManager.canCall(manager.address, rahatToken.target, mintId);

            //get target function role
            const targetFunctionRole = await rahatAccessManager.getTargetFunctionRole(rahatToken.target, mintId);

            //get target admin delay
            const targetAdminDelay = await rahatAccessManager.getTargetAdminDelay(rahatToken.target);
            //note: disable any acess if target is closed
            const isTargetClosed = await rahatAccessManager.isTargetClosed(rahatToken.target);
            console.log({ canCall });
            console.log({ targetFunctionRole });
            console.log({ isTargetClosed, targetAdminDelay });

        })
        it("should mint tokens", async function () {
            await rahatToken.connect(manager).mint(owner.address, 1000n);
            const isTargetClosedAfter = await rahatAccessManager.isTargetClosed(rahatToken.target);

            console.log({ isTargetClosedAfter })

            const ownerBalance = await rahatToken.balanceOf(owner.address);

            expect(ownerBalance).to.equal(1000n);
        });
        it("should transfer tokens", async function () {
            await rahatToken.connect(owner).transfer(manager.address, 100n);
            const managerBalance = await rahatToken.balanceOf(manager.address);
            expect(managerBalance).to.equal(100n);
        }
        );
    });

});


