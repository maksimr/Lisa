import { schema } from "normalizr";

export const ISSUE_SCHEMA = new schema.Entity(
  "issues",
  {},
  {
    idAttribute: "idReadable"
  }
);
