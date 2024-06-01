import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Flex,
  NumberInputField,
  NumberInput,
} from '@chakra-ui/react';

const EditOrderForm = ({ isOpen, onClose, order, onSubmit }) => {
  const { handleSubmit, control, reset } = useForm();

  useEffect(() => {
    if (order) {
      reset();
    }
  }, [order, reset]);

  return (
    <>
      {order && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Sale Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form id="edit-order-form" onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb={6}>
                  <FormLabel>Customer ID</FormLabel>
                  <Controller
                    name="customer_id"
                    control={control}
                    defaultValue={order.customer_id}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter Customer ID" />
                    )}
                  />
                </FormControl>
                <FormControl mb={2} display="none">
                  <FormLabel>ID</FormLabel>
                  <Controller
                    name={`id`}
                    control={control}
                    defaultValue={order.id}
                    render={({ field }) => <Input {...field} type="hidden" />}
                  />
                </FormControl>
                {order &&
                  order.items.map((sku, skuIndex) => (
                    <Box
                      position={'relative'}
                      key={skuIndex}
                      mb={4}
                      borderWidth="1px"
                      borderRadius="md"
                      p={4}
                    >
                      <FormControl mb={2} display="none">
                        <FormLabel>Sku ID</FormLabel>
                        <Controller
                          name={`items[${skuIndex}].sku_id`}
                          control={control}
                          defaultValue={sku.sku_id}
                          render={({ field }) => (
                            <Input {...field} type="hidden" />
                          )}
                        />
                      </FormControl>
                      <Flex mb={3}>
                        <FormControl mb={2} mr={2}>
                          <FormLabel>Selling Rate</FormLabel>
                          <Controller
                            name={`items[${skuIndex}].price`}
                            control={control}
                            defaultValue={sku.price}
                            render={({ field }) => (
                              <NumberInput {...field} min={1}>
                                <NumberInputField />
                              </NumberInput>
                            )}
                          />
                        </FormControl>

                        <FormControl mb={2} ml={2}>
                          <FormLabel>Quantity</FormLabel>
                          <Controller
                            name={`items[${skuIndex}].quantity`}
                            control={control}
                            defaultValue={sku.quantity}
                            render={({ field }) => (
                              <NumberInput {...field} min={1}>
                                <NumberInputField />
                              </NumberInput>
                            )}
                          />
                        </FormControl>
                      </Flex>
                    </Box>
                  ))}

                <FormControl my={4}>
                  <FormLabel>Invoice No</FormLabel>
                  <Controller
                    name="invoice_no"
                    control={control}
                    defaultValue={order.invoice_no}
                    render={({ field }) => (
                      <Input {...field} placeholder="Enter Invoice Number" />
                    )}
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Paid</FormLabel>
                  <Controller
                    name="paid"
                    control={control}
                    defaultValue={order.paid}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                      </Select>
                    )}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" mr={3}>
                  Submit
                </Button>
                <Button onClick={onClose} my={3}>
                  Cancel
                </Button>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default EditOrderForm;
