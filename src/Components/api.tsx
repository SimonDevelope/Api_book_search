import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../Styles/api.scss';

require('dotenv').config();

function Kakao() {
  const [bookList, setBookList] = useState<[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const loader: any = useRef();

  useEffect(() => {
    if (search.length > 0) {
      bookSearch(search, page);
    }
  }, [search, page]);

  const bookSearch = async (search: string, page: number) => {
    try {
      await setLoading(loading);
      await axios
        .get('https://dapi.kakao.com/v3/search/book', {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_KEY}`,
          },
          params: {
            query: search,
            sort: 'accuracy',
            page: page,
            size: 20,
          },
        })
        .then((response) => {
          setBookList(response.data.documents);
          console.log(page);
          setInputText('');
        });
    } catch (err) {
      console.log(err);
    }
    setLoading(loading);
    setBookList((prev) => [...prev, ...bookList]);
  };
  console.log(bookList);
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((page) => page + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) {
      observer.observe(loader.current);
    }
    console.log(loader);

    return () => observer && observer.disconnect();
  }, [handleObserver]);

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      setSearch(inputText);
    }
  };

  const TextUpdate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="total-view-port-inner-wrapper">
      <input
        placeholder="???????????? ???????????????."
        type="search"
        className="search-bar"
        name="search"
        value={inputText}
        onKeyDown={onEnter}
        onChange={TextUpdate}
      />
      <div className="list-total-warpper">
        <div className="list-outter-wrapper">
          {bookList.map((list: any, index) => {
            return (
              <div className="list-inner-wrapper" key={index}>
                <div className="list-image-wrapper">
                  <a href={list.url}>
                    <img src={list.thumbnail} alt={list.thumbnail} className="list-image-container"></img>
                  </a>
                </div>
                <div>
                  <div className="list-title-container">{list.title}</div>
                  <div className="list-price-container">?????? : {list.price}</div>
                </div>
              </div>
            );
          })}
          <div ref={loader}></div>
        </div>
      </div>
    </div>
  );
}

export default Kakao;
