import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import {
  Tab,
  Row,
  Col,
  Nav,
  Table,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import Layout from "../components/Layout";
import { CreatePosition, Position } from "../types/database";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient(ctx);

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { props: {} };
  }

  const positions = await supabase
    .from("positions")
    .select()
    .eq("user_id", data.user.id);

  return {
    props: {
      positions: positions.data,
    },
  };
}

export default function settings({ positions }: { positions: Position[] }) {
  const [toEdit, setToEdit] = useState<number | null>(null);
  const supabase = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  async function editPosition(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // @ts-ignore
    const data = new FormData(e.target);

    const side =
      data.get("side").length > 0
        ? data.get("side")
        : positions[toEdit].direction;
    const size =
      data.get("size").length > 0
        ? parseFloat(data.get("size") as string)
        : positions[toEdit].crypto_size;
    const leverage =
      data.get("leverage").length > 0
        ? parseFloat(data.get("leverage") as string)
        : positions[toEdit].leverage;
    const entry =
      data.get("entry").length > 0
        ? (data.get("entry") as string)
        : positions[toEdit].entry;

    const margin = (size * parseFloat(entry)) / leverage;

    await supabase
      .from("positions")
      .update<Position>({
        // @ts-ignore
        direction: side,
        crypto_size: size,
        leverage,
        entry: entry,
        margin,
      })
      .eq("id", positions[toEdit].id);

    router.reload();
  }

  return (
    <Layout>
      <div className="settings mtb15">
        <div className="container-fluid">
          <Tab.Container defaultActiveKey="profile">
            <Row>
              <Col lg={3}>
                <Nav variant="pills" className="settings-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col lg={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Editor</h5>
                        <div className="text-white">
                          {toEdit === null ? (
                            <p>Select a position to edit</p>
                          ) : (
                            <Form onSubmit={editPosition}>
                              <Form.Text className="mb-3">
                                Editing {positions[toEdit].symbol}
                              </Form.Text>

                              <Form.Text>Side</Form.Text>
                              <Form.Control
                                type="text"
                                placeholder={positions[toEdit].direction}
                                className="mb-3"
                                name="side"
                              />

                              <Form.Text>Size</Form.Text>
                              <Form.Control
                                type="number"
                                placeholder={positions[
                                  toEdit
                                ].crypto_size.toString()}
                                className="mb-3"
                                name="size"
                              />

                              <Form.Text>Leverage</Form.Text>
                              <Form.Control
                                type="number"
                                placeholder={positions[
                                  toEdit
                                ].leverage.toString()}
                                className="mb-3"
                                name="leverage"
                              />

                              <Form.Text>Entry</Form.Text>
                              <Form.Control
                                type="text"
                                placeholder={positions[toEdit].entry.toString()}
                                className="mb-3"
                                name="entry"
                              />
                              <Button variant="primary" type="submit">
                                Submit
                              </Button>
                            </Form>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Edit Positions</h5>
                        <Table>
                          <thead>
                            <tr>
                              <th>Symbol</th>
                              <th>Side</th>
                              <th>Size</th>
                              <th>Leverage</th>
                              <th>Entry</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {positions &&
                              positions.map((position, idx) => (
                                <tr>
                                  <td>{position.symbol}</td>
                                  <td>{position.direction}</td>
                                  <td>{position.crypto_size}</td>
                                  <td>{position.leverage}</td>
                                  <td>{position.entry}</td>
                                  <td>
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => setToEdit(idx)}
                                    >
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </Layout>
  );
}
