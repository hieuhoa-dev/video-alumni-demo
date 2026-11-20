import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import {
  DluAlumniShowcase,
  defaultShowcaseProps,
  type ShowcaseProps,
} from "./compositions/DluAlumniShowcase";
import { SCENES, TOTAL_FRAMES } from "./data/scenesConfig";
import { FPS, STAGE_HEIGHT, STAGE_WIDTH } from "./theme";

/**
 * Đo thời lượng từng file quay rồi tính `playbackRate` để mỗi file khớp đúng
 * số frame của cảnh: rate = độ dài file (giây) / độ dài cảnh (giây).
 */
const calculateMetadata: CalculateMetadataFunction<ShowcaseProps> = async ({
  props,
}) => {
  const playbackRates: Record<number, number> = {};

  if (props.useRecordings) {
    await Promise.all(
      SCENES.map(async (scene) => {
        if (typeof scene.playbackRate === "number") return;
        const sceneSeconds = scene.durationInFrames / FPS;
        try {
          const meta = await getVideoMetadata(staticFile(scene.videoSrc));
          const rate = meta.durationInSeconds / sceneSeconds;
          playbackRates[scene.id] = rate;
          if (rate < 0.5 || rate > 2.5) {
            console.warn(
              `[scene-${scene.id}] file quay dài ${meta.durationInSeconds.toFixed(1)}s, cảnh dài ${sceneSeconds}s → playbackRate ${rate.toFixed(2)}. Cân nhắc cắt/quay lại cho sát hơn.`,
            );
          }
        } catch (error) {
          console.warn(
            `[scene-${scene.id}] không đọc được ${scene.videoSrc}, dùng playbackRate 1.`,
            error,
          );
          playbackRates[scene.id] = 1;
        }
      }),
    );
  }

  return { props: { ...props, playbackRates } };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DluAlumniShowcase"
      component={DluAlumniShowcase}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      defaultProps={defaultShowcaseProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
