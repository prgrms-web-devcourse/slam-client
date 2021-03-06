import { MouseEvent, useState } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { css } from "@emotion/react";
import { Text, Button } from "@components/base";
import managementApi from "@service/managementApi";
import { useRouter } from "next/router";

import type { NewCourt } from "./types";

interface Props {
  data: NewCourt;
  state: "READY" | "DONE";
  [x: string]: any;
}
const NewCourtItem = ({
  data,
  state,
  style,
  setIsOpenDenyModal,
  setIsOpenAcceptModal,
}: Props) => {
  const router = useRouter();

  const handleDeny = async (
    e: MouseEvent<HTMLButtonElement>,
    newCourtId: number
  ) => {
    e.preventDefault();
    try {
      await managementApi.denyNewCourt(newCourtId);
      setIsOpenDenyModal(true);
      setTimeout(() => {
        setIsOpenDenyModal(false);
        router.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccept = async (
    e: MouseEvent<HTMLButtonElement>,
    newCourtId: number
  ) => {
    e.preventDefault();
    try {
      await managementApi.acceptNewCourt(newCourtId);
      setIsOpenAcceptModal(true);
      setTimeout(() => {
        setIsOpenAcceptModal(false);
        router.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Link href={`/admin/newcourts/${data.newCourtId}`} passHref>
      <Container style={style}>
        <CourtName strong block>
          {data.courtName}
        </CourtName>
        {state === "READY" ? (
          <ButtonContainer>
            <Button
              fullWidth
              tertiary
              onClick={(e) => handleDeny(e, data.newCourtId)}
            >
              거절하기
            </Button>
            <Button fullWidth onClick={(e) => handleAccept(e, data.newCourtId)}>
              승인하기
            </Button>
          </ButtonContainer>
        ) : data.status === "ACCEPT" ? (
          <StatusBar fullWidth className="accept">
            승인됨
          </StatusBar>
        ) : (
          <StatusBar fullWidth className="deny">
            거절됨
          </StatusBar>
        )}
      </Container>
    </Link>
  );
};

export default NewCourtItem;

const Container = styled.a`
  ${({ theme }) => css`
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
    box-sizing: border-box;
    background-color: ${theme.colors.white};
    border-radius: ${theme.borderRadiuses.md};
    box-shadow: ${theme.boxShadows.sm};
    padding: ${theme.gaps.base};
  `}
`;

const StatusBar = styled(Button)`
  text-align: center;

  &.accept {
    background: ${({ theme }) => theme.colors.green.light};
  }

  &.deny {
    background: ${({ theme }) => theme.colors.red.light};
  }
`;

const CourtName = styled(Text)`
  margin-bottom: ${({ theme }) => theme.gaps.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;
