import { useSearch } from "wouter";
import { useHistoryState } from "wouter/use-browser-location";

type SearchParams<
  KeyType extends string = string,
  ValueType extends string = string,
> = Record<KeyType, ValueType | undefined>;

type UpdateSearchParams<
  KeyType extends string = string,
  ValueType extends string = string,
> = (params: Partial<SearchParams<KeyType, ValueType>>) => void;

export const useExtractedSearchParams = <
  T extends string = string,
  V extends string = string,
>(): [SearchParams<T, V>, UpdateSearchParams<T, V>] => {
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
      const _key = key as T;
      if (newParamsObject[_key] === undefined) {
        delete newParamsObject[_key];
      }
    }
    const updatedParams = new URLSearchParams(
      newParamsObject as Record<string, string>
    );
    const paramsString = updatedParams.toString();
    window.history.pushState(state, "", `?${paramsString}`);
  };
  return [
    paramsObject as SearchParams<T, V>,
    update as UpdateSearchParams<T, V>,
  ];
};
