export interface Video {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number;
  image_url: string;
  videoURL: string;
}

export interface VideoProgress {
  id: number;
  time: number;
  movie: number;
}

export interface ConvertableVideo {
  id: number;
  video_120p: string;
  video_360p: string;
  video_720p: string;
  video_1080p: string;
  movie: number;
}
