import { BigNumberish } from 'ethers';
import { TransactionReceipt } from '@ethersproject/providers';
import { IEntryPoint } from 'aa-conla-utils';
/**
 * This class encapsulates Ethers.js listener function and necessary UserOperation details to
 * discover a TransactionReceipt for the operation.
 */
export declare class UserOperationEventListener {
    readonly resolve: (t: TransactionReceipt) => void;
    readonly reject: (reason?: any) => void;
    readonly entryPoint: IEntryPoint;
    readonly sender: string;
    readonly userOpHash: string;
    readonly nonce?: BigNumberish | undefined;
    readonly timeout?: number | undefined;
    resolved: boolean;
    boundLisener: (this: any, ...param: any) => void;
    constructor(resolve: (t: TransactionReceipt) => void, reject: (reason?: any) => void, entryPoint: IEntryPoint, sender: string, userOpHash: string, nonce?: BigNumberish | undefined, timeout?: number | undefined);
    start(): void;
    stop(): void;
    listenerCallback(this: any, ...param: any): Promise<void>;
    extractFailureReason(receipt: TransactionReceipt): Promise<void>;
}
