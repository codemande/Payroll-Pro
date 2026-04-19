import "../../styles/skeleton.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };