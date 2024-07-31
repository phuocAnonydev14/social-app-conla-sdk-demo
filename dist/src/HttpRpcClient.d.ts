import { UserOperation } from 'aa-conla-utils';
export declare class HttpRpcClient {
    readonly bundlerUrl: string;
    readonly entryPointAddress: string;
    readonly chainId: number;
    private readonly userOpJsonRpcProvider;
    initializing: Promise<void>;
    constructor(bundlerUrl: string, entryPointAddress: string, chainId: number);
    validateChainId(): Promise<void>;
    /**
     * send a UserOperation to the bundler
     * @param userOp1
     * @return userOpHash the id of this operation, for getUserOperationTransaction
     */
    sendUserOpToBundler(userOp1: UserOperation): Promise<string>;
    /**
     * estimate gas requirements for UserOperation
     * @param userOp1
     * @returns latest gas suggestions made by the bundler.
     */
    estimateUserOpGas(userOp1: Partial<UserOperation>): Promise<{
        callGasLimit: number;
        preVerificationGas: number;
        verificationGasLimit: number;
    }>;
    private printUserOperation;
}
