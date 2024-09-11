import type { ComponentPropsWithoutRef, SyntheticEvent } from "react";
import { forwardRef, Fragment, useCallback, useEffect, useState } from "react";
import { s3 } from "~/hooks/use-s3";
import { cn } from "~/lib/utils";
import { Loader } from "./loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { VisuallyHidden } from "../ui/visually-hidden";
import { Icon } from "./app-icon";

type HTMLImageProps = ComponentPropsWithoutRef<"img">;

export type AppImageProps = (
  | ({
      useS3?: false;
      fileKey?: never;
    } & HTMLImageProps)
  | ({
      useS3: true;
      fileKey: string;
    } & Omit<HTMLImageProps, "src">)
) & {
  silentError?: boolean;
  onLoadingStateChange?: (loading: boolean) => void;
};

export const AppImage = forwardRef<HTMLImageElement, AppImageProps>(
  (
    {
      className,
      useS3 = false,
      silentError = false,
      fileKey,
      onError,
      onLoad,
      onLoadCapture,
      onLoadingStateChange,
      ...props
    },
    ref
  ) => {
    const [loadingError, setLoadingError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);

    useEffect(() => {
      onLoadingStateChange?.(isImageLoading);
    }, [onLoadingStateChange, isImageLoading]);

    const { data, isLoading, isError } = s3.useDownloadImage(
      { fileKey: useS3 ? fileKey! : "" },
      { enabled: useS3 }
    );

    const handleImageLoadingError = useCallback(
      (e: SyntheticEvent<HTMLImageElement, Event>) => {
        setLoadingError(true);
        onError?.(e);
      },
      [onError]
    );
    const handleImageLoadingStart = useCallback(
      (e: SyntheticEvent<HTMLImageElement, Event>) => {
        setIsImageLoading(true);
        onLoadCapture?.(e);
      },
      [onLoadCapture]
    );
    const handleImageLoadingEnd = useCallback(
      (e: SyntheticEvent<HTMLImageElement, Event>) => {
        setIsImageLoading(false);
        onLoad?.(e);
      },
      [onLoad]
    );

    const errored = isError || loadingError;
    const loading = (useS3 && (isLoading || data == null)) || isImageLoading;

    const Wrapper = errored || loading ? VisuallyHidden : Fragment;

    const src = "src" in props ? props.src : data;

    if (errored && silentError) {
      return (
        <img
          loading="lazy"
          data-erroredonsrc={src}
          {...props}
          src="https://via.placeholder.com/150"
          className={cn("w-full", className)}
          ref={ref}
        />
      );
    }
    return (
      <>
        {errored && !silentError && (
          <Alert variant="destructive">
            <Icon name="CircleAlert" />
            <AlertTitle>Error loading image</AlertTitle>
            <AlertDescription>
              There was an error loading the image. Please try again.
            </AlertDescription>
          </Alert>
        )}
        {loading && <Loader />}
        <Wrapper>
          <img
            loading="lazy"
            {...props}
            onError={handleImageLoadingError}
            onLoadCapture={handleImageLoadingStart}
            onLoad={handleImageLoadingEnd}
            className={cn("w-full", className)}
            src={src}
            ref={ref}
          />
        </Wrapper>
      </>
    );
  }
);

AppImage.displayName = "AppImage";
