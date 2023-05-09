import React from "react";
import { Card } from "react-bootstrap";
import { IconBaseProps } from "react-icons";
import { Link } from "react-router-dom";

type IconProps = IconBaseProps & {
  style?: React.CSSProperties;
  size?: number;
};
type HomeLinkCardProps = {
  title: string;
  icon: React.ReactElement<IconProps>;
  href: string;
};

const HomeLinkCard: React.FC<HomeLinkCardProps> = ({ title, href, icon }) => {
  return (
    <>
      <Link to={href} style={{ textDecoration: "none" }}>
        <Card bg="dark" text="white" className="p-2 shadow-lg bg-opacity-75">
          <Card.Body
            style={{ position: "relative", overflow: "hidden", minWidth: 200 }}
          >
            {React.cloneElement(icon, {
              size: 72,
              style: { position: "absolute", top: 0, left: 0, opacity: 0.3 },
            })}

            <Card.Title
              className="mt-3 text-info"
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: 32,
                textShadow: "0 0 5px #000",
              }}
            >
              {title}
            </Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </>
  );
};

export default HomeLinkCard;
