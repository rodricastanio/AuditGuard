export interface AutoPrResult {
    prUrl: string | null;
    created: boolean;
}
export declare function createAutoPr(branchName: string, title: string, body: string, token: string): Promise<AutoPrResult>;
//# sourceMappingURL=pull-request.d.ts.map