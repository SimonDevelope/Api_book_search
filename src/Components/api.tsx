import React, { useEffect, useState } from "react";
import axios from "axios";
import BookList from "./BookList";
import "../Styles/api.scss";

require("dotenv").config();

function Kakao() {
  const [bookList, setBookList] = useState<[]>([]);
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  //임시
  console.log(bookList);
  console.log(content);
  const pressEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      setContent(search);
    }
  };
  const searchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  const bookSearch = async () => {
    try {
      await axios
        .get("https://dapi.kakao.com/v3/search/book", {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_KEY}`,
          },
          params: {
            query: "미움받을 용기",
            sort: "accuracy",
            page: 1,
            size: 20,
          },
        })
        .then((response) => {
          setBookList(response.data);
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    bookSearch();
  }, []);
  return (
    <div className="total-view-port-inner-wrapper">
      <input
        placeholder="검색어를 입력하세요."
        type="search"
        name="query"
        value={search}
        className="search-bar"
        onKeyDown={pressEnter}
        onChange={searchChange}
      />
      <BookList />
    </div>
  );
}

export default Kakao;
