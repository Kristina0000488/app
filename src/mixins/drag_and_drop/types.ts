export interface BlockProps {
  src: string;
  id: number;
  type: 'img' | 'video' | 'iframe';
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DivProps = Pick<BlockProps, 'x' | 'y' | 'width' | 'height'>;
export type Target = Pick<BlockProps, 'id' | 'src' | 'type'>;
