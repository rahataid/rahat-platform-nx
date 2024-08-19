
import { ethers } from 'ethers';
import { commonLib } from './_common';

class AccessControl extends commonLib {
    constructor() {
        super();

    }

    private getContract(contractAddress: string, abi: any, signer: any) {
        return new ethers.Contract(contractAddress, abi, signer);

    }

    private async getFunctionId(contractName: string, functionName: string) {
        const contract = await this.getContractArtifacts(contractName);
        const contractInterface = new ethers.Interface(contract.abi);
        const signature = contractInterface.getFunction(functionName)?.format();
        return ethers?.FunctionFragment.from(signature).selector;

    }

    public async addAdminRestrictions() {
        console.log("--------Adding Admin Restrictions--------");

        const adminWallet = await this.getDeployerWallet();
        const accessManagerAddress = await this.getDeployedAddress('contracts', 'RahatAccessManager');
        const rahatTreasuryAddress = await this.getDeployedAddress('contracts', 'RahatTreasury');
        const accessManager = await this.getContractArtifacts('RahatAccessManager');
        const accessManagerContract = this.getContract(accessManagerAddress, accessManager.abi, adminWallet);

        const createTokenId = await this.getFunctionId('RahatTreasury', 'createToken');
        const mintTokenAndApproveId = await this.getFunctionId('RahatTreasury', 'mintTokenAndApprove');
        const mintTokenAndSendId = await this.getFunctionId('RahatTreasury', 'mintTokenAndSend');

        console.log("Setting target for create token")
        await accessManagerContract.setTargetFunctionRole(rahatTreasuryAddress, [createTokenId], 0);
        await this.sleep(5000);
        console.log("Setting target for mint token and approve")
        await accessManagerContract.setTargetFunctionRole(rahatTreasuryAddress, [mintTokenAndApproveId], 0);
        await this.sleep(5000);
        console.log("Setting target for mint token and send")
        await accessManagerContract.setTargetFunctionRole(rahatTreasuryAddress, [mintTokenAndSendId], 0);

    }

    public async assignAdminRole(address: string) {
        const adminWallet = await this.getDeployerWallet();
        const accessManagerAddress = await this.getDeployedAddress('contracts', 'RahatAccessManager');
        const accessManager = await this.getContractArtifacts('RahatAccessManager');
        const accessManagerContract = this.getContract(accessManagerAddress, accessManager.abi, adminWallet);

        const tx = await accessManagerContract.grantRole(0, address, 0);
        await tx.wait();


    }
}

async function main() {
    const accessControl = new AccessControl();
    await accessControl.addAdminRestrictions();
    //to Add admin role 
    const adminAddress = '0x';
    await accessControl.assignAdminRole(adminAddress);
}
main();