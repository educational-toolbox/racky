import { useSearch } from "wouter";
import { useHistoryState } from "wouter/use-browser-location";

type SearchParams<
  KeyType extends string = string,
  ValueType = string | undefined,
> = Record<KeyType, ValueType>;

type UpdateSearchParams<KeyType extends string = string> = (
  params: Partial<SearchParams<KeyType>>
) => void;

export const useExtractedSearchParams = <T extends string = string>(): [
  SearchParams<T>,
  UpdateSearchParams<T>,
] => {
  const searchString = useSearch();
  const state = useHistoryState();
  const params = new URLSearchParams(searchString);
  const entries = Array.from(params.entries());
  const paramsObject = Object.fromEntries(entries);
  const update = (newParams: Record<string, string | undefined>) => {
    const newParamsObject = {
      ...paramsObject,
      ...newParams,
    } as SearchParams<T>;
    for (const key in newParamsObject) {
      let _key = key as T;
      if (newParamsObject[_key] === undefined) {
        delete newParamsObject[_key];
      }
    }
    const updatedParams = new URLSearchParams(
      newParamsObject as SearchParams<T, string>
    );
    const paramsString = updatedParams.toString();
    window.history.pushState(state, "", `?${paramsString}`);
  };
  return [paramsObject as SearchParams<T>, update as UpdateSearchParams<T>];
};
