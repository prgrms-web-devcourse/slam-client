import { useEffect, useState, useCallback } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import userApi from "@service/userApi";
import UtilRoute from "UtilRoute";
import { Avatar, Button, Label, Spacer, Chip, Text } from "@components/base";
import {
  useNavigationContext,
  useAuthContext,
  useSocketContext,
} from "@contexts/hooks";
import {
  ProfileFavoritesListItem,
  BasketballLoading,
} from "@components/domain";
import { ProficiencyKeyUnion, PositionKeyUnion } from "@domainTypes/.";
import {
  getTranslatedPositions,
  getTranslatedProficiency,
} from "@utils/userInfo";
import Custom404 from "@pages/404";

type ResponseUserProfile = {
  createdAt: string;
  updatedAt: string;
  userId: number;
  nickname: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  profileImage: string;
  description: string;
  proficiency: ProficiencyKeyUnion;
  positions: PositionKeyUnion[];
  favoriteCourts: [
    {
      courtId: number;
      courtName: string;
    },
    {
      courtId: number;
      courtName: string;
    }
  ];
};

const User: NextPage = UtilRoute("private", () => {
  const {
    navigationProps,
    useMountPage,
    setNavigationTitle,
    useDisableTopTransparent,
  } = useNavigationContext();
  const { sendFollow, sendFollowCancel } = useSocketContext();
  const { authProps } = useAuthContext();

  const { userId, favorites } = authProps.currentUser;

  useMountPage((page) => page.USER);
  useDisableTopTransparent();

  const { query } = useRouter();
  const { userId: stringQueryUserId } = query;
  const queryUserId = Number(stringQueryUserId);

  const [isMe, setIsMe] = useState(false);
  const [pageUserInfo, setPageUserInfo] = useState<ResponseUserProfile | null>(
    null
  );
  const [isError, setIsError] = useState(false);

  const getMyProfile = useCallback(async () => {
    try {
      const data = await userApi.getMyProfile<ResponseUserProfile>();
      setPageUserInfo(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getOtherProfile = useCallback(async () => {
    try {
      const data = await userApi.getUserProfile<ResponseUserProfile>(
        queryUserId
      );
      setPageUserInfo(data);
    } catch (error: any) {
      console.error(error);
      const { message } = error.response.data;
      if (message === "Entity Not Found") {
        setIsError(true);
      }
    }
  }, [queryUserId]);

  const handleClickFollow = (prevIsFollowing: boolean) => {
    if (pageUserInfo) {
      if (prevIsFollowing) {
        sendFollowCancel({ receiverId: pageUserInfo.userId });
      } else {
        sendFollow({ receiverId: pageUserInfo.userId });
      }
      setPageUserInfo((prevState) =>
        prevState
          ? {
              ...prevState,
              isFollowing: !prevIsFollowing,
              followerCount: prevIsFollowing
                ? prevState.followerCount - 1
                : prevState.followerCount + 1,
            }
          : null
      );
    }
  };

  useEffect(() => {
    setNavigationTitle(`${pageUserInfo?.nickname}`);
  }, [pageUserInfo?.nickname, setNavigationTitle]);

  useEffect(() => {
    if (queryUserId === userId) {
      setIsMe(true);
      getMyProfile();
    } else {
      getOtherProfile();
    }
  }, [userId, getMyProfile, getOtherProfile, queryUserId]);

  if (pageUserInfo === null) {
    if (isError) {
      return <Custom404 />;
    }

    return <BasketballLoading />;
  }

  const {
    nickname,
    profileImage,
    followingCount,
    followerCount,
    description,
    positions,
    proficiency,
    isFollowing,
  } = pageUserInfo;

  return (
    <div>
      <Head>
        <title>{nickname}?????? ????????? | Slam - ?????? ?????? ???????????? ?????????</title>
        <meta name="description" content="???????????? ????????? ??? ?????????" />
      </Head>

      <MainInfoContainer
        isBackgroundTransparent={navigationProps.isTopTransparent}
      >
        <MainInfoArea>
          <Avatar src={profileImage} shape="circle" />
          <StatBar>
            <div>
              <Link href={`/user/${userId}/following`}>
                <a>
                  <dt>?????????</dt>
                  <dd>
                    <Text strong>{followingCount}</Text>
                  </dd>
                </a>
              </Link>
            </div>
            <div>
              <Link href={`/user/${userId}/follower`}>
                <a>
                  <dt>?????????</dt>
                  <dd>
                    <Text strong>{followerCount}</Text>
                  </dd>
                </a>
              </Link>
            </div>
            <div>
              <dt>?????? ??????</dt>
              <dd
                onClick={() => alert("?????? ??????")}
                style={{ cursor: "pointer" }}
              >
                6.3
              </dd>
            </div>
          </StatBar>
        </MainInfoArea>
        <Description>{description}</Description>
        {!isMe ? (
          <ButtonContainer>
            <Link href={`/chat/${userId}`} passHref>
              <a style={{ width: "100%" }}>
                <Button fullWidth secondary>
                  ?????????
                </Button>
              </a>
            </Link>

            <Button
              fullWidth
              tertiary={isFollowing}
              onClick={() => handleClickFollow(isFollowing)}
            >
              {isFollowing ? `?????????` : `?????????`}
            </Button>
          </ButtonContainer>
        ) : (
          <div>
            <Link href={`/user/edit`} passHref>
              <a>
                <Button fullWidth secondary>
                  ????????? ??????
                </Button>
              </a>
            </Link>
          </div>
        )}
      </MainInfoContainer>

      <AdditionalInfoSpacer gap="base" type="vertical">
        <div>
          <Label>?????????</Label>
          <Spacer gap="xs">
            {positions.length ? (
              getTranslatedPositions(positions).map(({ english, korean }) => (
                <Chip key={english} secondary>
                  {korean}
                </Chip>
              ))
            ) : (
              <Chip key={"no_position"} secondary>
                ????????? ???????????? ????????????
              </Chip>
            )}
          </Spacer>
        </div>
        <div>
          <Label>?????????</Label>
          <Chip secondary>{getTranslatedProficiency(proficiency).korean}</Chip>
        </div>
        <div>
          <Label>{isMe ? "??????" : `${nickname}??????`} ???????????? ?????????</Label>
          {favorites.length ? (
            favorites.map(({ courtId, courtName }) => (
              <ProfileFavoritesListItem key={courtId} courtId={courtId}>
                {courtName}
              </ProfileFavoritesListItem>
            ))
          ) : (
            <Chip secondary>????????? ???????????? ????????????</Chip>
          )}
        </div>
      </AdditionalInfoSpacer>
    </div>
  );
});

export default User;

const MainInfoContainer = styled.div<{ isBackgroundTransparent: boolean }>`
  ${({ theme, isBackgroundTransparent }) => css`
    padding: ${theme.gaps.lg} ${theme.gaps.base} ${theme.gaps.md};
    background: rgba(255, 255, 255, ${isBackgroundTransparent ? 0 : 1});
    transition: background 200ms;
  `}
`;

const AdditionalInfoSpacer = styled(Spacer)`
  ${({ theme }) => css`
    padding: ${theme.gaps.md} ${theme.gaps.base};
  `}
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MainInfoArea = styled(FlexContainer)`
  ${({ theme }) => css`
    padding: 0 ${theme.gaps.xs};
  `}
`;

const ButtonContainer = styled(FlexContainer)`
  ${({ theme }) => css`
    gap: 0 ${theme.gaps.xs};
  `}
`;

const StatBar = styled.dl`
  ${({ theme }) => css`
    display: flex;
    text-align: center;
    margin: 0;
    flex-grow: 1;
    margin-left: ${theme.gaps.lg};
    justify-content: space-evenly;

    dd {
      box-sizing: border-box;
      margin: 0;
      font-weight: bold;
      padding: ${theme.gaps.xs} 0;
    }
  `}
`;

const Description = styled.div`
  ${({ theme }) => css`
    margin: ${theme.gaps.md} 0;
    line-height: 1.4;
  `}
`;
