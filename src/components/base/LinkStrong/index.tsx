import styled from "@emotion/styled";
import Link from "next/link";
import { ReactNode } from "react";
import { UrlObject } from "url";

interface Props {
  href: string | UrlObject;
  children: ReactNode;
}

const LinkStrong = ({ href, children }: Props) => (
  <Link href={href} passHref>
    <a>
      <Strong>{children}</Strong>
    </a>
  </Link>
);

export default LinkStrong;

const Strong = styled.strong`
  :hover {
    cursor: pointer;
  }
`;
