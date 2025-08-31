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
        <Navbar expand="lg">
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
              <NavDropdown title="Buy Crypto">
                <Link href="/settings" legacyBehavior>
                  <a className="dropdown-item">Settings</a>
                </Link>
                <button className="dropdown-item" onClick={update}>
                  Toggle Theme
                </button>
              </NavDropdown>
              <NavDropdown title="Markets" />
              <NavDropdown title="Trading Bots" />
              <NavDropdown title="Tools" />
              <NavDropdown title="Finance" />
              <NavDropdown title="Derivatives Info" />
              <NavDropdown title="More" />
            </Nav>
            <Nav className="navbar-nav ml-auto">
              <NavDropdown title="Assets" />
              <NavDropdown title="Orders" />

              <Link href="/" legacyBehavior>
                <a className="nav-link">
                  <svg
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <defs>
                      <symbol viewBox="0 0 24 24" id="account-f">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM14.5 9.5C14.5 10.8807 13.3807 12 12 12C10.6193 12 9.5 10.8807 9.5 9.5C9.5 8.11929 10.6193 7 12 7C13.3807 7 14.5 8.11929 14.5 9.5ZM12 13.9961H8.66662C7.97115 13.9961 7.37518 14.7661 7.12537 15.5161C7.73252 16.4634 9.45831 17.9803 12 18.0023C14.5416 18.0243 16.3061 16.3616 16.8745 15.5161C16.6247 14.7661 16.0288 13.9961 15.3333 13.9961H12Z"
                          fill="currentColor"
                        ></path>
                      </symbol>
                    </defs>
                    <g fill="#EAECEF">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3ZM14.5 9.5C14.5 10.8807 13.3807 12 12 12C10.6193 12 9.5 10.8807 9.5 9.5C9.5 8.11929 10.6193 7 12 7C13.3807 7 14.5 8.11929 14.5 9.5ZM12 13.9961H8.66662C7.97115 13.9961 7.37518 14.7661 7.12537 15.5161C7.73252 16.4634 9.45831 17.9803 12 18.0023C14.5416 18.0243 16.3061 16.3616 16.8745 15.5161C16.6247 14.7661 16.0288 13.9961 15.3333 13.9961H12Z"
                        fill="currentColor"
                      ></path>
                    </g>
                  </svg>
                </a>
              </Link>

              <Link href="/" legacyBehavior>
                <a className="nav-link">Buy Crypto</a>
              </Link>

              <Link href="/" legacyBehavior>
                <a className="nav-link">Markets</a>
              </Link>

              <Link href="/" legacyBehavior>
                <a className="nav-link">
                  <svg
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    class="css-3kwgah"
                    width="24"
                    height="24"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.5 3H19v18H6.5v-2.5H4V16h2.5v-2.75H4v-2.5h2.5V8H4V5.5h2.5V3zm6.25 4.75c-.69 0-1.25.56-1.25 1.25v.5H9V9a3.75 3.75 0 116.402 2.652L14 13.053V14.5h-2.5v-2.482l2.134-2.134a1.25 1.25 0 00-.884-2.134zM11.5 19v-2.5H14V19h-2.5z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
              </Link>

              <Link href="/" legacyBehavior>
                <a className="nav-link">
                  <svg
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="24"
                    height="24"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.8 3h-3.6v2.027c-.66.17-1.285.431-1.858.77L6.91 4.363 4.363 6.91l1.434 1.433a7.157 7.157 0 00-.77 1.858H3v3.6h2.027c.17.66.431 1.285.77 1.858L4.363 17.09l2.546 2.546 1.433-1.434c.573.339 1.197.6 1.858.77V21h3.6v-2.027a7.157 7.157 0 001.858-.77l1.433 1.434 2.546-2.546-1.434-1.434a7.16 7.16 0 00.77-1.857H21v-3.6h-2.027a7.158 7.158 0 00-.77-1.858l1.434-1.433-2.546-2.546-1.434 1.434a7.156 7.156 0 00-1.857-.77V3zm-4.5 9a2.7 2.7 0 115.4 0 2.7 2.7 0 01-5.4 0z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
              </Link>
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
