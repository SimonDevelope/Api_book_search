import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/api.scss";

require("dotenv").config();
interface nextPageData {
  next?: string;
}

function Kakao() {
  const [bookList, setBookList] = useState<[]>([]);
  const [nextList, setNextList] = useState<nextPageData>({ next: undefined });
  const [inputText, setInputText] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [moreData, setMoreData] = useState<boolean>(false);

  useEffect(() => {
    if (search.length > 0) {
      bookSearch(search);
    }
  }, [search]);

  const bookSearch = async (search: string) => {
    try {
      await axios
        .get("https://dapi.kakao.com/v3/search/book", {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_KEY}`,
          },
          params: {
            query: search,
            sort: "accuracy",
            page: 1,
            size: 20,
          },
        })
        .then((response) => {
          setBookList(response.data.documents);
          setInputText("");
          setNextList(response.data.meta.is_end);
          console.log(nextList);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const loadMoreData = async () => {
    await axios.get(nextList.next).then((response) => {
      const loadedData = response.data.documents;
      const addUpData = bookList.concat(...loadedData);
      setBookList(addUpData);
    });
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      setSearch(inputText);
    }
  };

  const TextUpdate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="total-view-port-inner-wrapper">
      <input
        placeholder="검색어를 입력하세요."
        type="search"
        className="search-bar"
        name="search"
        value={inputText}
        onKeyDown={onEnter}
        onChange={TextUpdate}
      />
      <div className="list-total-warpper">
        <div className="list-outter-wrapper">
          {bookList.map((list: any, index: any) => {
            return (
              <div className="list-inner-wrapper">
                <div key={index} className="list-image-wrapper">
                  <a href={list.url}>
                    <img
                      src={list.thumbnail}
                      alt={list.thumbnail}
                      className="list-image-container"
                    ></img>
                  </a>
                </div>
                <div>
                  <div className="list-title-container">{list.title}</div>
                  <div className="list-price-container">
                    가격 : {list.price}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Kakao;
