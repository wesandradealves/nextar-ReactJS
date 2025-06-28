import { Container, FaqItem, Question, Answer } from './styles';

const FaqSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <FaqItem key={index} className="p-6 rounded-[12px] animate-pulse bg-gray-200">
          <Question className="text-lg font-bold h-6 bg-gray-300 rounded w-3/4 mb-4" />
          <Answer className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
          </Answer>
        </FaqItem>
      ))}
    </Container>
  );
};

export default FaqSkeleton;
