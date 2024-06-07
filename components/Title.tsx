import { SlideInText } from './AnimatedText';

export const Title = () => {
  return (
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold">
      <SlideInText text="NPM Downloads" />
    </h1>
  );
};
