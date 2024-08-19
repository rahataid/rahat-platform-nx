
import { ethers } from 'ethers';
import { commonLib } from '../local-setup/web3_setup/_common';

class AccessControl extends commonLib {

    private getContract(contractAddress: string, abi: any, signer: any) {
        return new ethers.Contract(contractAddress, abi, signer);

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
    //to Add admin role 
    const adminAddress = '0x';
    await accessControl.assignAdminRole(adminAddress);
}
main();