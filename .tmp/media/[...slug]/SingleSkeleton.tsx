import { FiClock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { Container, Title } from '@/components/section/styles';
import classNames from 'classnames';

export default function SingleSkeleton() {
  return (
    <>
      <Container
        className="text-white text-center pt-[190px] pb-[90px] bg-fixed bg-cover relative overflow-hidden"
        backgroundimage=""
        backgroundposition="center top"
      >
        <div className="container m-auto gap-6 flex flex-col relative z-10">
          <div className="inline-flex text-base lg:text-xl items-center gap-2 text-gray-400">
            <FiArrowLeft />
            <span className="bg-gray-600 h-4 w-40 rounded animate-pulse" />
          </div>

          <ul className="flex flex-wrap gap-4 text-sm list-none text-base lg:text-xl text-gray-400">
            <li className="flex items-center gap-2">
              <FiUser size={16} />
              <span className="bg-gray-600 h-4 w-24 rounded animate-pulse" />
            </li>
            <li className="flex items-center gap-2">
              <FiClock size={16} />
              <span className="bg-gray-600 h-4 w-32 rounded animate-pulse" />
            </li>
          </ul>

          <Title className="text-start leading-1 text-xl lg:text-4xl">
            <div className="bg-gray-500 h-10 w-full max-w-[600px] rounded animate-pulse mb-2" />
            <div className="bg-gray-500 h-10 w-4/5 rounded animate-pulse" />
          </Title>

          <div className="flex gap-2 flex-wrap items-center justify-center">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className="bg-gray-600 h-8 w-24 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        <div
          className={classNames(
            'absolute inset-0 w-full h-full bg-black opacity-80 z-1'
          )}
        />
      </Container>

      <div className="container m-auto py-[90px] flex flex-col gap-6 text-white">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-700 h-6 w-full rounded animate-pulse"
            style={{ maxWidth: `${90 - i * 10}%` }}
          />
        ))}
      </div>
    </>
  );
}
