import { Container, Item, ItemInner } from './styles';

const MediaSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <Item key={idx} className="animate-pulse">
            <ItemInner className="flex flex-col gap-4 rounded-[48px] h-full overflow-hidden">
              <div className="bg-gray-700 w-full h-[190px]" />
              <div className="flex flex-col gap-4 p-6 pt-0">
                <div className="bg-gray-600 h-4 w-2/3 rounded" />
                <div className="bg-gray-600 h-6 w-full rounded" />
                <div className="bg-gray-600 h-4 w-5/6 rounded" />
              </div>
            </ItemInner>
          </Item>
        ))}
      </div>
    </Container>
  );
};

export default MediaSkeleton;
