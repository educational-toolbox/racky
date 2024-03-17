import { api } from "~/utils/api/server";

export const ServerDataExample = async function () {
  const helloFromServer = await api.hello.query({ name: "Server call" });
  return <p>{helloFromServer}</p>;
};
