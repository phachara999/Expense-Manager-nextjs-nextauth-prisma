"use client";
import React, { useState, useEffect } from "react";
import AddModal from "./components/add";
import { Button, Card, CardBody, Divider, Spinner, Pagination } from "@nextui-org/react";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [limit, setLimit] = useState(10);

  const fetchTransaction = async (page, type = currentFilter) => {
    setLoading(true);
    try {
      const newPage = type !== currentFilter ? 1 : page;
      const res = await fetch(`/api/transaction?page=${newPage}&limit=${limit}&type=${type}`);
      const data = await res.json();
      setTransactions(data.data);
      setTotalPages(data.meta.totalPages);
      setCurrentPage(newPage);
      setCurrentFilter(type);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction(1, "all");
  }, []);

  const handleFilterChange = (type) => {
    fetchTransaction(1, type);
  };

  const handlePageChange = (page) => {
    fetchTransaction(page, currentFilter);
  };

  return (
    <>
      <div className="flex justify-end my-3 mr-3">
        <AddModal fechTransaction={() => fetchTransaction(currentPage, currentFilter)} />
      </div>
      <Divider />
      <div className="flex justify-around my-3">
        <Button onClick={() => handleFilterChange("all")} color="primary">ทั้งหมด</Button>
        <Button onClick={() => handleFilterChange("income")} color="success">รายรับ</Button>
        <Button onClick={() => handleFilterChange("expense")} color="danger">รายจ่าย</Button>
      </div>
      <Divider />
      <div className="flex justify-end items-center m-3">
        <Pagination 
          total={totalPages} 
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
      <div className="m-3 mt-5 ">
        {loading ? (
          <div className="flex justify-center items-center ">
            <Spinner size="lg" color="success" />
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Card key={transaction.id} className={transaction.type === "income" ? "bg-green-400 mb-3" : "bg-red-400 mb-3"}>
              <CardBody>
                <div className="flex justify-between">
                  <div>
                    <p>{transaction.name}</p>
                  </div>
                  <div>
                    {transaction.type === "income" ? "+" : "-"} {transaction.amount} บาท
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <p>No transactions available</p>
        )}
      </div>
    </>
  );
}