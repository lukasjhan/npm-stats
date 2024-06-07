export const SlideInText = ({ text }: { text: string }) => {
  return (
    <>
      {text.split("").map((letter, index) => (
        <span key={index} className="inline-block slideInUp" style={{ animationDelay: `${index * 0.05}s` }}>
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </>
  );
};
