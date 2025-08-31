import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Order, Position } from "../types/database";

const Context = createContext<{
  balance: number;
  avblBalance: number;
  positions: Position[];
  orders: Order[];
} | null>(null);

interface User {
  id: string;
  username: string;
  balance: number;
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [balance, setBalance] = useState<number>(0);

  const avblBalance = useMemo(() => {
    let totalMargin = 0;

    positions.forEach((position) => {
      // totalMargin += position.usd_size / position.leverage;
      totalMargin += position.margin;
    });

    orders.forEach((order) => {
      totalMargin += order.margin;
    });

    return balance - totalMargin;
  }, [positions, balance]);

  const fetchBalance = () => {
    if (!user) return;

    supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .limit(1)
      .single<User>()
      .then((payload) => {
        setBalance(payload.data.balance);
      });
  };

  const fetchOrders = () => {
    if (!user) return;

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .returns<Order[]>()
      .then((payload) => {
        if (payload.error) {
          return;
        }

        setOrders(payload.data);
      });
  };

  const fetchPositions = () => {
    if (!user) return;

    supabase
      .from("positions")
      .select("*")
      .eq("user_id", user.id)
      .returns<Position[]>()
      .then((payload) => {
        if (payload.error) {
          return;
        }

        setPositions(payload.data);
      });
  };

  const removeDuplicates = (orders) => {
    return orders.reduce((uniqueOrders, order) => {
      if (!uniqueOrders.some((uniqueOrder) => uniqueOrder.id === order.id)) {
        uniqueOrders.push(order);
      }
      return uniqueOrders;
    }, []);
  };

  useEffect(() => {
    if (!user) return;

    fetchBalance();
    fetchOrders();
    fetchPositions();

    const userSubscription = supabase
      .channel("any")
      .on<{ id: string; username: string; balance: number }>(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        (payload) => {
          console.log("User updated");
          fetchBalance();
        }
      )
      .subscribe();

    const orderSubscription = supabase
      .channel("any")
      .on<Order>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
          if (payload.new.user_id !== user.id) return;

          setOrders((prevOrders) => [...prevOrders, payload.new]);
        }
      )
      .on<Order>(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders" },
        (payload) => {
          console.log("Delete received!", payload);

          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== payload.old.id)
          );
        }
      )
      .on<Order>(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          console.log("Update received!", payload);
          if (payload.new.user_id !== user.id) return;

          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === payload.new.id ? payload.new : order
            )
          );
        }
      )
      .subscribe();

    const positionSubscription = supabase
      .channel("any")
      .on<Position>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "positions" },
        (payload) => {
          console.log("Change received!", payload);

          if (payload.new.user_id !== user.id) return;
          setPositions((prevPositions) => [...prevPositions, payload.new]);
        }
      )
      .on<Position>(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "positions" },
        (payload) => {
          console.log("Delete received!", payload);
          setPositions((prevPositions) =>
            prevPositions.filter((position) => position.id !== payload.old.id)
          );
        }
      )
      .on<Position>(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "positions" },
        (payload) => {
          console.log("Update received!", payload);
          if (payload.new.user_id !== user.id) return;

          setPositions((prevPositions) =>
            prevPositions.map((position) =>
              position.id === payload.new.id ? payload.new : position
            )
          );
        }
      )
      .subscribe();

    return () => {
      orderSubscription.unsubscribe();
      positionSubscription.unsubscribe();
      userSubscription.unsubscribe();
    };
  }, [user]);

  return (
    <Context.Provider value={{ balance, avblBalance, positions, orders }}>
      {children}
    </Context.Provider>
  );
};

export const useData = () => useContext(Context);
