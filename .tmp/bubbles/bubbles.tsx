"use client";

import { Container } from './styles';
import { Props } from './typo';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Title, Text, Item, ImgWrapper, Blob } from './styles';
import classNames from 'classnames';
import { truncateText } from '../opnioes/';
import { useEffect, useState } from 'react';

export default function Bubbles({ className, data }: Props) {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.outerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container
      className={classNames(`${className} flex flex-wrap list-none items-center justify-center gap-10 flex-col lg:flex-row`, {
        'lg:-mt-[54px]': data.length > 1
      })}>
      {data &&
        data.map((item, index) => (
          <Item
            title={item.text}
            key={index}
            className={classNames('flex flex-col justify-center items-center gap-4 relative', {
              'lg:flex-col-reverse lg:pt-[125px] -me-[10px] -ms-[10px]': index % 2 !== 0,
            })}
          >
            <ImgWrapper className='flex  lg:hover:scale-[1.1] flex-col justify-center items-center  m-auto relative'>
              {(item.image) && (<span className='rounded-full p-8 overflow-hidden z-10'>
                <LazyLoadImage className='max-w-[100%]' src={item.image || ''} />
              </span>)}

              {index < data.length - 1 && (
                  <Blob
                    className={classNames('absolute hidden lg:block transform z-1', {
                      '-top-[21%] left-[70%] rotate-[15deg]': index % 2 !== 0,
                      'top-[40%] left-[66%] -rotate-[15deg]': index % 2 === 0,
                    })}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 200 200">
                      <defs>
                        <linearGradient
                          id={`gradient-${index}`}
                          gradientTransform="rotate(264.72)"
                        >
                          <stop offset="4.22%" stopColor="rgba(70, 54, 0, 0.34)" />
                          <stop offset="22.85%" stopColor="rgba(255, 199, 0, 0.34)" />
                          <stop offset="34.42%" stopColor="rgba(179, 107, 0, 0.34)" />
                          <stop offset="47.27%" stopColor="rgba(255, 199, 0, 0.34)" />
                          <stop offset="68.47%" stopColor="rgba(255, 166, 0, 0.34)" />
                          <stop offset="87.75%" stopColor="rgba(223, 169, 24, 0.34)" />
                          <stop offset="96.75%" stopColor="rgba(253, 221, 2, 0.34)" />
                          <stop offset="105.1%" stopColor="rgba(255, 199, 0, 0.34)" />
                          <stop offset="116.67%" stopColor="rgba(235, 106, 20, 0.34)" />
                          <stop offset="127.59%" stopColor="rgba(255, 199, 0, 0.34)" />
                        </linearGradient>
                      </defs>
                      <path fill={`url(#gradient-${index})`} d="M100.254 200c-3.154 0-5.82-2.284-6.584-5.344-2.435-9.753-7.096-20.125-13.983-31.114-8.16-13.195-19.791-25.434-34.895-36.719-13.137-9.929-26.274-16.7-39.41-20.312C2.27 105.656 0 102.897 0 99.671c0-3.164 2.183-5.892 5.225-6.76C18.105 89.234 30.512 83.263 42.448 75c13.715-9.549 25.173-21.007 34.375-34.375 8.14-11.909 13.728-23.686 16.763-35.333C94.382 2.241 97.068 0 100.221 0c3.188 0 5.893 2.29 6.669 5.383 1.752 6.982 4.49 14.129 8.214 21.44 4.688 9.028 10.677 17.708 17.969 26.042 7.465 8.16 15.799 15.538 25 22.135 12.024 8.523 24.247 14.511 36.671 17.964 3.048.847 5.256 3.56 5.256 6.723 0 3.211-2.275 5.947-5.371 6.796-7.875 2.159-15.981 5.641-24.316 10.444-10.07 5.903-19.445 12.934-28.126 21.094-8.68 7.986-15.798 16.406-21.354 25.26-6.9 11.012-11.566 21.464-13.996 31.358-.754 3.069-3.424 5.361-6.583 5.361Z"></path><defs><linearGradient id="paint0_linear_104_40" x1="27.5" x2="149" y1="19" y2="174.5" gradientUnits="userSpaceOnUse"><stop stopColor="#FFD9A0"></stop><stop offset="1" stopColor="#FFF5F1"></stop>
                      </linearGradient>
                      </defs>
                    </svg>
                  </Blob>
                )}
            </ImgWrapper>
            <div className='flex flex-col gap-1 text-center '>
              {item.title && <Title className='font-bold leading-none text-lg' dangerouslySetInnerHTML={{ __html: item.title }} />}
              {item.text && <Text className='max-w-[150px] text-base leading-[1.2] m-auto' dangerouslySetInnerHTML={{ __html: isDesktop ? truncateText(item.text, 37) : item.text }} />}
            </div>
          </Item>
        ))}
    </Container>
  );
}