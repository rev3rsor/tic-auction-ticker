import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SheetContext } from "~src/components/SheetProvider";
import { Row } from "~src/models/Row";

import { Button, ErrorText, Form, Input, Label } from "./styles";

type FormData = {
  /** Item number */
  number: string;
  /** Name of new highest bidder */
  highestBidder: string;
  /** New price */
  price: string;
};

type Error = {
  field: "number" | "highestBidder" | "price" | "api";
  message: string;
};

const UpdateForm = (): React.ReactElement => {
  const doc = useContext(SheetContext);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Error[] | null>(null);

  const {
    handleSubmit: handleSubmitWithHandler,
    register,
    reset,
  } = useForm<FormData>();

  const handleSubmit = handleSubmitWithHandler(async (data) => {
    if (!doc || isSubmitting) return;

    const missingRequiredFieldsErrors: Error[] = [];

    // type is number so no issues with 0
    if (!data.number) {
      missingRequiredFieldsErrors.push({
        field: "number",
        message: "Item number is required",
      });
    }

    if (!data.highestBidder) {
      missingRequiredFieldsErrors.push({
        field: "highestBidder",
        message: "Bidder is required",
      });
    }

    if (!data.number) {
      missingRequiredFieldsErrors.push({
        field: "price",
        message: "Price is required",
      });
    } else if (parseInt(data.number, 10) <= 0) {
      missingRequiredFieldsErrors.push({
        field: "price",
        message: "Price must be positive",
      });
    }

    if (missingRequiredFieldsErrors.length > 0) {
      setErrors(missingRequiredFieldsErrors);
      return;
    }

    setIsSubmitting(true);

    let newRows: Row[];

    try {
      newRows = (await doc.sheetsByIndex[0].getRows()) as Row[];
    } catch {
      setErrors([{ field: "api", message: "Please try again!" }]);
      setIsSubmitting(false);
      return;
    }

    const matchingRowIndex = newRows.findIndex(
      ({ number }) => number === data.number.toUpperCase()
    );
    const matchingRow = newRows[matchingRowIndex];

    if (!matchingRow) {
      setErrors([
        {
          field: "number",
          message: "No matching item number found!",
        },
      ]);
      return;
    }

    if (matchingRow.highestBidder === data.highestBidder) {
      setErrors([
        {
          field: "highestBidder",
          message: "This person is already the highest bidder!",
        },
      ]);
      return;
    }

    if (parseInt(matchingRow.price, 10) >= (parseInt(data.price, 10) || 0)) {
      setErrors([
        {
          field: "price",
          message: "Bid is not higher than the current bid!",
        },
      ]);
      return;
    } else if (
      parseInt(data.price, 10) - (parseInt(matchingRow.price, 10) || 0) >
      3
    ) {
      setErrors([
        {
          field: "price",
          message: "Can't bid more than 3 above the current bid!",
        },
      ]);
      return;
    }

    setErrors(null);

    if (matchingRow.highestBidder && matchingRow.price) {
      await doc.sheetsByIndex[1].addRow({
        number: matchingRow.number,
        highestBidder: matchingRow.highestBidder,
        price: matchingRow.price,
      });
    }

    newRows[matchingRowIndex].highestBidder = data.highestBidder;
    newRows[matchingRowIndex].price = data.price;

    await newRows[matchingRowIndex].save();

    setIsSubmitting(false);
    reset();
  });

  return (
    <Form onSubmit={handleSubmit}>
      <Label>
        <span>Item number</span>
        <Input {...register("number")} type="number" />
      </Label>
      <ErrorText>
        {errors?.find(({ field }) => field === "number")?.message || null}
      </ErrorText>

      <Label>
        <span>Bidder</span>
        <Input {...register("highestBidder")} />
      </Label>
      <ErrorText>
        {errors?.find(({ field }) => field === "highestBidder")?.message ||
          null}
      </ErrorText>

      <Label>
        <span>Bid</span>
        <Input {...register("price")} type="number" />
      </Label>
      <ErrorText>
        {errors?.find(({ field }) => field === "price")?.message || null}
      </ErrorText>

      <Button disabled={!doc || isSubmitting}>
        {doc ? "Update bid" : "Loading..."}
      </Button>
      <ErrorText>
        {errors?.find(({ field }) => field === "price")?.message || null}
      </ErrorText>
    </Form>
  );
};

export default UpdateForm;
