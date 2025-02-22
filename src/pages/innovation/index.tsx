import React, { useEffect, useState } from "react";
import { paths } from "Consts/path";
import TopBar from "Components/topBar";
import Container from "Components/container";
import CardCategory from "Components/card/category";
import { useNavigate, useParams, generatePath } from "react-router-dom";
import CardInnovation from "Components/card/innovation";
import { useQuery } from "react-query";
import { getCategories } from "Services/categoryServices";
import Loading from "Components/loading";
import { getInnovations } from "Services/innovationServices";
import {
  Container as CategoryContainer,
  DetailContainer,
} from "./_innovationStyle";

function Detail() {
  const navigate = useNavigate();
  const { category } = useParams();

  const { data } = useQuery("innovationByCategory", getInnovations);
  const innovationByCategory = data?.filter(
    (item: any) => item.category === category
  );

  if (innovationByCategory?.length === 0) return <p>Inovasi tidak ditemukan</p>;
  
  return (
    <DetailContainer>
      {innovationByCategory?.map((item: any, idx: number) => (
        <CardInnovation
          key={idx}
          {...item}
          onClick={() =>
            navigate(
              generatePath(paths.DETAIL_INNOVATION_PAGE, { id: item?.idUnik })
            )
          }
        />
      ))}
    </DetailContainer>
  );
}

type ListProps = {
  data: any;
  isFetched: boolean;
  isLoading: boolean;
};

function List(props: ListProps) {
  const { data, isFetched, isLoading } = props;

  const navigate = useNavigate();
  const [menu, setMenu] = useState<any>([]);

  const handleClick = (category: string) => {
    const path = generatePath(paths.INNOVATION_CATEGORY_PAGE, {
      category: category,
    });
    navigate(path);
  };

  useEffect(() => {
    if (isFetched) {
      const temp = [...data?.slice(0, data?.length - 1)];
      setMenu(temp);
    }
  }, [isFetched]);

  return (
    <React.Fragment>
      {isLoading && <Loading fullHeight />}
      {isFetched &&
        menu.map((item: any, idx: number) => (
          <CardCategory
            {...item}
            key={idx}
            onClick={() => handleClick(item.title)}
          />
        ))}
    </React.Fragment>
  );
}

function Innovation() {
  const navigate = useNavigate();
  const { category } = useParams();

  const { data, isFetched, isLoading } = useQuery("category", getCategories);
  const title = isFetched
    ? data?.find((item: any) => item.title === category)?.title
    : "Kategori Inovasi";

  const listProps = {
    data,
    isFetched,
    isLoading,
  };

  return (
    <Container page>
      <TopBar title={title || "Kategori Inovasi"} onBack={() => navigate(-1)} />
      <CategoryContainer>
        {category && <Detail />}
        {!category && <List {...listProps} />}
      </CategoryContainer>
    </Container>
  );
}

export default Innovation;
