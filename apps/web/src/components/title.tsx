import { useDocumentTitle } from "../hooks/use-document-title";

export const Title = ({
  children,
  override,
}: {
  children: string;
  override?: boolean;
}) => {
  useDocumentTitle(children, override);
  return null;
};
