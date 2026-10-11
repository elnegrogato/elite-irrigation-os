/* eslint-disable */
import type { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

export type TableNames = string;
export type Doc<TableName extends TableNames = TableNames> = any;
export type Id<TableName extends TableNames = TableNames> = GenericId<TableName>;
export type DataModel = AnyDataModel;
