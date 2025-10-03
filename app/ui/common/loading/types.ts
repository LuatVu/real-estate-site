export interface LoadingProps {
  /**
   * Size of the loading component
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional message to display below the loading animation
   */
  message?: string;
  
  /**
   * Whether to display as a full-screen overlay
   * @default false
   */
  fullScreen?: boolean;
  
  /**
   * Additional CSS class names to apply to the container
   */
  className?: string;
}

export interface LoadingComponent extends React.FC<LoadingProps> {}

declare const Loading: LoadingComponent;
export default Loading;