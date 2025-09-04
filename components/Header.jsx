import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Navbar, Nav, NavDropdown, Dropdown, Button } from "react-bootstrap";
import { ThemeConsumer, useTheme } from "../context/ThemeContext";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const Selector = () => (
  <svg
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id="svgtoexport"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    width="24"
    height="24"
  >
    <defs>
      <symbol viewBox="0 0 24 24" id="icon-h-top-menu-s">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4 4H8V8H4V4ZM4 10H8V14H4V10ZM8 16H4V20H8V16ZM10 4H14V8H10V4ZM14 10H10V14H14V10ZM10 16H14V20H10V16ZM20 4H16V8H20V4ZM16 10H20V14H16V10ZM20 16H16V20H20V16Z"
          fill="currentColor"
        ></path>
      </symbol>
    </defs>
    <g fill="#EAECEF">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4 4H8V8H4V4ZM4 10H8V14H4V10ZM8 16H4V20H8V16ZM10 4H14V8H10V4ZM14 10H10V14H14V10ZM10 16H14V20H10V16ZM20 4H16V8H20V4ZM16 10H20V14H16V10ZM20 16H16V20H20V16Z"
        fill="currentColor"
      ></path>
    </g>

    <style jsx>{`
      svg {
        box-sizing: border-box;
        margin: 0;
        min-width: 0;
        color: currentColor;
        width: 24px;
        height: 24px;
        font-size: 24px;
        fill: currentColor;
        color: currentColor;
      }
    `}</style>
  </svg>
);

export default function Header() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();
  const {
    update,
    data: { theme },
  } = useTheme();

  const logout = async () => {
    console.log("Signing out");
    try {
      const res = await supabase.auth.signOut();

      if (res.error) {
        throw res.error;
      }
      console.log(res);
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let el = document.querySelector("#darkTheme");
    if (el) {
      el.addEventListener("click", function () {
        document.body.classList.toggle("dark");
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>MasterTrader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="light-bb font-weight-normal">
        <Navbar expand="lg" style={{ background: "#17181e !important" }}>
          <Link href="/" legacyBehavior>
            <a className="p-2 pr-0 mx-0">
              <img
                class="logo"
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODciIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCA4NyAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYyLjAwODMgMjUuMzU3MlYzSDY2LjUwMjJWMjUuMzU3Mkg2Mi4wMDgzWiIgZmlsbD0iI0Y3QTYwMCIvPgo8cGF0aCBkPSJNOS42MzQwNyAzMS45OTgzSDBWOS42NDExMUg5LjI0NjY2QzEzLjc0MDYgOS42NDExMSAxNi4zNTkxIDEyLjA5MDMgMTYuMzU5MSAxNS45MjE0QzE2LjM1OTEgMTguNDAxMyAxNC42Nzc0IDIwLjAwMzkgMTMuNTEzNCAyMC41Mzc1QzE0LjkwMjggMjEuMTY1MiAxNi42ODEzIDIyLjU3NzkgMTYuNjgxMyAyNS41NjI0QzE2LjY4MTMgMjkuNzM3MyAxMy43NDA2IDMxLjk5ODMgOS42MzQwNyAzMS45OTgzWk04Ljg5MDk2IDEzLjUzNTVINC40OTM5VjE4LjY4NTJIOC44OTA5NkMxMC43OTgxIDE4LjY4NTIgMTEuODY1MiAxNy42NDg4IDExLjg2NTIgMTYuMTA5NUMxMS44NjUyIDE0LjU3MTkgMTAuNzk4MSAxMy41MzU1IDguODkwOTYgMTMuNTM1NVpNOS4xODE1MSAyMi42MTA0SDQuNDkzOVYyOC4xMDU2SDkuMTgxNTFDMTEuMjE4OSAyOC4xMDU2IDEyLjE4NzQgMjYuODUwMyAxMi4xODc0IDI1LjM0MThDMTIuMTg3NCAyMy44MzUgMTEuMjE3MSAyMi42MTA0IDkuMTgxNTEgMjIuNjEwNFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zMC4zODgyIDIyLjgyOTNWMzEuOTk4M0gyNS45MjZWMjIuODI5M0wxOS4wMDczIDkuNjQxMTFIMjMuODg4NkwyOC4xODg4IDE4LjY1MjdMMzIuNDIzOSA5LjY0MTExSDM3LjMwNTJMMzAuMzg4MiAyMi44MjkzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTUwLjA0NTcgMzEuOTk4M0g0MC40MTE2VjkuNjQxMTFINDkuNjU4M0M1NC4xNTIyIDkuNjQxMTEgNTYuNzcwNyAxMi4wOTAzIDU2Ljc3MDcgMTUuOTIxNEM1Ni43NzA3IDE4LjQwMTMgNTUuMDg5IDIwLjAwMzkgNTMuOTI1IDIwLjUzNzVDNTUuMzE0NCAyMS4xNjUyIDU3LjA5MyAyMi41Nzc5IDU3LjA5MyAyNS41NjI0QzU3LjA5MyAyOS43MzczIDU0LjE1MjIgMzEuOTk4MyA1MC4wNDU3IDMxLjk5ODNaTTQ5LjMwMjYgMTMuNTM1NUg0NC45MDU1VjE4LjY4NTJINDkuMzAyNkM1MS4yMDk3IDE4LjY4NTIgNTIuMjc2OCAxNy42NDg4IDUyLjI3NjggMTYuMTA5NUM1Mi4yNzY4IDE0LjU3MTkgNTEuMjA5NyAxMy41MzU1IDQ5LjMwMjYgMTMuNTM1NVpNNDkuNTkzMSAyMi42MTA0SDQ0LjkwNTVWMjguMTA1Nkg0OS41OTMxQzUxLjYzMDUgMjguMTA1NiA1Mi41OTkgMjYuODUwMyA1Mi41OTkgMjUuMzQxOEM1Mi41OTkgMjMuODM1IDUxLjYzMDUgMjIuNjEwNCA0OS41OTMxIDIyLjYxMDRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNODAuOTg2IDEzLjUzNTVWMzJINzYuNDkyMVYxMy41MzU1SDcwLjQ3ODVWOS42NDExMUg4Ni45OTk2VjEzLjUzNTVIODAuOTg2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
                alt="logo"
                width="56"
                height="22"
              />
            </a>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar-nav mr-auto">
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#eaecef",
                    }}
                  >
                    Buy Crypto
                  </span>
                }
              >
                <Link href="/settings" legacyBehavior>
                  <a className="dropdown-item">Settings</a>
                </Link>
                <button className="dropdown-item" onClick={update}>
                  Toggle Theme
                </button>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#eaecef",
                    }}
                  >
                    Markets
                  </span>
                }
              />
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#f7a600",
                      borderBottom: "2px solid #f7a600",
                      paddingBottom: "4px",
                    }}
                  >
                    Trade
                  </span>
                }
              />
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#eaecef",
                    }}
                  >
                    Tools
                  </span>
                }
              />
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#eaecef",
                    }}
                  >
                    Finance
                  </span>
                }
              />
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#eaecef",
                    }}
                  >
                    Derivatives Info
                  </span>
                }
              />
              <NavDropdown
                title={
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#eaecef",
                    }}
                  >
                    More
                  </span>
                }
              />
              <img
                src="/Screenshot 2025-09-04 at 2.22.43 AM.png"
                alt="Navbar right side icons"
                style={{
                  height: "32px",
                  width: "auto",
                  cursor: "pointer",
                  objectFit: "contain",
                }}
              />
            </Nav>
            <Nav className="navbar-nav ml-auto">
              {/* Navbar right side icons - Using exact image from screenshot */}
              <img
                src="/Screenshot 2025-09-04 at 2.17.05 AM.png"
                alt="Navbar right side icons"
                style={{
                  height: "28px",
                  width: "auto",
                  cursor: "pointer",
                  objectFit: "contain",
                }}
              />
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>

      <style jsx>{`
        .nav-link {
          font-weight: normal;
        }

        .css-17hpqak {
          box-sizing: border-box;
          margin: 0;
          min-width: 0;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          position: relative;
          border-radius: 4px;
          margin-left: 8px;
          padding-left: 4px;
          padding-right: 4px;
          font-size: 12px;
          line-height: 16px;
          background-color: #fcd535;
          color: #1e2329;
        }

        .css-17hpqak:before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          left: -3px;
          top: 2px;
          border-left: 0;
          border-left-width: 0px;
          border-left-style: initial;
          border-left-color: initial;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid;
          border-right-color: #fcd535;
        }
      `}</style>
    </>
  );
}
