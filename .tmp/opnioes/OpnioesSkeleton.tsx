import { Container, Item, ItemInner, Rating, Title } from './styles';

const OpnioesSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <Container>
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i}>
          <ItemInner className="animate-pulse bg-gray-100 p-9 rounded-[48px] h-full flex flex-col gap-4 text-base">
            <Rating className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-gray-300" />
              ))}
            </Rating>
            <Title className="h-4 bg-gray-300 rounded w-1/2 mt-auto" />
          </ItemInner>
        </Item>
      ))}
    </Container>
  );
};

export default OpnioesSkeleton;
