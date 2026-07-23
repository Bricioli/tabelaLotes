export interface BulkDeleteDto {
    ids: number[];
}
export declare const parseBulkDeleteBody: (body: unknown) => {
    dto?: BulkDeleteDto;
    errors: string[];
};
//# sourceMappingURL=bulk-delete.dto.d.ts.map