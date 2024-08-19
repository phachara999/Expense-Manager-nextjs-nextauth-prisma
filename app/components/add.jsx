"use client";
import { React ,useEffect, useState} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, RadioGroup,Radio ,DatePicker} from "@nextui-org/react";

export default function AddModal({ fechTransaction }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
 
  const add = async (formData) => {
    await fetch("/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        amount: formData.get("amount"),
        type: formData.get("type"),
      })
    })
    fechTransaction();
  }
  return (
    <>
      <Button color="secondary"  onPress={onOpen}>เพิ่มรายการ</Button>
      <Modal 
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          }
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">เพิ่มรายการ</ModalHeader>
              <form action={add}>
                <ModalBody>
                  <Input name="name" label="ชื่อรายการ" />
                  <Input name="amount" label="จํานวนเงิน" />
                  <div className="flex gap-1">
                    <RadioGroup
                      name="type"
                      label="เลือกรายการ"
                    >
                      <Radio color="success" value="income">รายรับ</Radio>
                      <Radio color="danger" value="expense">รายจ่าย</Radio>
                    </RadioGroup>           
                  </div>           
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    ปิด
                  </Button>
                  <Button color="primary" type="submit" onPress={onClose}>
                    เพิ่ม
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
