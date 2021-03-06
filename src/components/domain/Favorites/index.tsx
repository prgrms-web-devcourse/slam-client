import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NextPage } from "next";
import UtilRoute from "UtilRoute";
import styled from "@emotion/styled";
import { Button, Spacer } from "@components/base";
import { useAuthContext, useNavigationContext } from "@contexts/hooks";
import Paragraph from "@components/base/Skeleton/Paragraph";
import favoriteAPI from "@service/favoriteApi";
import CourtItem from "../CourtItem";
import NoItemMessage from "../NoItemMessage";

declare global {
  interface Window {
    Kakao: any;
  }
}

const Favorites: NextPage = UtilRoute("private", () => {
  const { authProps } = useAuthContext();
  const { userId } = authProps.currentUser;

  const { useMountPage } = useNavigationContext();
  useMountPage((page) => page.FAVORITES);

  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const getPageFavorites = async () => {
    try {
      const { favorites } = await favoriteAPI.getMyFavorites();
      setFavorites(favorites);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getPageFavorites();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <Spacer gap="base" type="vertical">
        <FavoriteItem>
          <Paragraph line={4} fontSize={20} lineHeight={2.0} lineBreak={1} />
        </FavoriteItem>
        <FavoriteItem>
          <Paragraph line={4} fontSize={20} lineHeight={2.0} lineBreak={1} />
        </FavoriteItem>
        <FavoriteItem>
          <Paragraph line={4} fontSize={20} lineHeight={2.0} lineBreak={1} />
        </FavoriteItem>
      </Spacer>
    );
  }

  if (favorites.length === 0) {
    return (
      <NoItemMessage
        title={"즐겨찾는 농구장이 없으시네요? 🤔"}
        type="favorite"
        description={"즐겨찾기하면 더 빠르게 예약하실 수 있어요"}
        buttonTitle={"즐겨찾는 농구장 등록하기"}
      />
    );
  }

  return (
    <Spacer
      gap="base"
      type="vertical"
      style={{
        marginTop: 56,
      }}
    >
      {favorites.map(
        ({ favoriteId, courtName, courtId, latitude, longitude }) => (
          <FavoriteItem key={favoriteId}>
            <Spacer gap="xs" type="vertical">
              <CourtItem.Header>{courtName}</CourtItem.Header>
              {/* <CourtItem.Address>{"주소 넣기"}</CourtItem.Address> */}
            </Spacer>

            <Actions gap="xs">
              <CourtItem.FavoritesToggle courtId={courtId} />
              <CourtItem.ShareButton />
              <CourtItem.ChatLink courtId={courtId} />
              <CourtItem.KakaoMapLink
                latitude={latitude}
                longitude={longitude}
                courtName={courtName}
              />
              <Link href={`/courts?courtId=${courtId}`} passHref>
                <Button size="lg" style={{ flex: 1 }}>
                  예약하기
                </Button>
              </Link>
            </Actions>
          </FavoriteItem>
        )
      )}
    </Spacer>
  );
});

const Actions = styled(Spacer)`
  margin-top: 40px;
`;

const FavoriteItem = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  padding: 20px;
`;

export default Favorites;
