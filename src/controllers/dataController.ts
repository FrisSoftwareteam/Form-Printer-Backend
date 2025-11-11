import { Request, Response } from "express";
import mongoose from "mongoose";
import UploadMetadata from "../models/UploadMetadata.js";
import PrescoData from "../models/PrescoData.js";

export const searchByName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query) {
      res.status(400).json({
        success: false,
        error: "Query parameter is required",
      });
      return;
    }

    const searchTerm = query as string;

    const searchQuery: any = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { mobile_no: { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (!isNaN(Number(searchTerm))) {
      searchQuery.$or.push({ account_number: Number(searchTerm) });
    }

    const results = await PrescoData.find(searchQuery).lean();

    const transformedResults = results.map((item: any) => ({
      id: item.s_no,
      accountNumber: item.account_number?.toString(),
      names: item.name,
      address: item.address,
      unitsHeld: item.units_held?.toString(),
      rightDue: item.rights_due?.toString(),
      amountPayable: item.amount?.toString(),
      mobile: item.mobile_no || null,
      emailAddress: item.email || null,
    }));

    res.json({
      data: transformedResults,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error searching data",
    });
  }
};

export const searchByField = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { field } = req.params;
    const { value, collection } = req.query;

    if (!value) {
      res.status(400).json({
        success: false,
        error: "Value query parameter is required",
      });
      return;
    }

    const searchValue = value as string;
    const collectionName = (collection as string) || "prescodatas";

    if (collectionName === "prescodatas") {
      const validFields = [
        "name",
        "email",
        "mobile_no",
        "account_number",
        "address",
        "s_no",
        "units_held",
        "rights_due",
        "amount",
      ];

      if (!validFields.includes(field)) {
        res.status(400).json({
          success: false,
          error: `Field '${field}' is not valid. Valid fields: ${validFields.join(
            ", "
          )}`,
        });
        return;
      }

      let searchQuery: any;

      if (
        [
          "account_number",
          "s_no",
          "units_held",
          "rights_due",
          "amount",
        ].includes(field)
      ) {
        searchQuery = { [field]: Number(searchValue) };
      } else {
        searchQuery = { [field]: { $regex: searchValue, $options: "i" } };
      }

      const results = await PrescoData.find(searchQuery).lean();

      const transformedResults = results.map((item: any) => ({
        id: item.s_no,
        accountNumber: item.account_number?.toString(),
        names: item.name,
        address: item.address,
        unitsHeld: item.units_held?.toString(),
        rightDue: item.rights_due?.toString(),
        amountPayable: item.amount?.toString(),
        mobile: item.mobile_no || null,
        emailAddress: item.email || null,
      }));

      res.json({
        data: transformedResults,
      });
      return;
    }

    const Model = mongoose.models[collectionName];
    if (!Model) {
      res.status(404).json({
        success: false,
        error: `Collection '${collectionName}' not found`,
      });
      return;
    }

    if (!Model.schema.paths[field]) {
      res.status(400).json({
        success: false,
        error: `Field '${field}' does not exist in collection`,
      });
      return;
    }

    const searchQuery = {
      [field]: { $regex: searchValue, $options: "i" },
    };

    const results = await Model.find(searchQuery).lean();

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error searching data",
    });
  }
};

export const getAllData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { collection } = req.query;
    const collectionName = (collection as string) || "prescodatas";

    if (collectionName === "prescodatas") {
      const results = await PrescoData.find({}).lean();

      res.json({
        success: true,
        data: results,
        count: results.length,
      });
      return;
    }

    const Model = mongoose.models[collectionName];
    if (!Model) {
      res.status(404).json({
        success: false,
        error: `Collection '${collectionName}' not found`,
      });
      return;
    }

    const results = await Model.find({}).lean();

    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error: any) {
    console.error("Get data error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching data",
    });
  }
};

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { collection } = req.query;

    let metadata;

    if (collection) {
      metadata = await UploadMetadata.findOne({ collectionName: collection });
    } else {
      metadata = await UploadMetadata.findOne().sort({ uploadedAt: -1 });
    }

    if (!metadata) {
      res.status(404).json({
        success: false,
        error: "No upload metadata found",
      });
      return;
    }

    res.json({
      success: true,
      stats: {
        collectionName: metadata.collectionName,
        originalFileName: metadata.originalFileName,
        totalRows: metadata.totalRows,
        fields: metadata.fields,
        uploadedAt: metadata.uploadedAt,
        uploadedBy: metadata.uploadedBy,
      },
    });
  } catch (error: any) {
    console.error("Stats error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching stats",
    });
  }
};

export const getCollections = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const collections = await UploadMetadata.find({}).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      collections: collections.map((col) => ({
        name: col.collectionName,
        totalRows: col.totalRows,
        fields: col.fields,
        uploadedAt: col.uploadedAt,
      })),
    });
  } catch (error: any) {
    console.error("Collections error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching collections",
    });
  }
};

export const getRecordById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { collection } = req.query;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Account number is required",
      });
      return;
    }

    const collectionName = (collection as string) || "prescodatas";

    if (collectionName === "prescodatas") {
      const result = await PrescoData.findOne({
        account_number: Number(id),
      }).lean();

      if (!result) {
        res.status(404).json({
          success: false,
          error: "Record not found",
        });
        return;
      }

      const mappedData = {
        id: result.s_no,
        accountNumber: result.account_number?.toString(),
        names: result.name,
        address: result.address,
        unitsHeld: result.units_held?.toString(),
        rightDue: result.rights_due?.toString(),
        amountPayable: result.amount?.toString(),
        mobile: result.mobile_no,
        emailAddress: result.email,
      };

      res.json({
        success: true,
        data: mappedData,
      });
      return;
    }

    const Model = mongoose.models[collectionName];
    if (!Model) {
      res.status(404).json({
        success: false,
        error: `Collection '${collectionName}' not found`,
      });
      return;
    }

    if (!Model.schema.paths.account_number) {
      res.status(400).json({
        success: false,
        error: "account_number field does not exist in this collection",
      });
      return;
    }

    const result = await Model.findOne({ account_number: id }).lean();

    if (!result) {
      res.status(404).json({
        success: false,
        error: "Record not found",
      });
      return;
    }

    const mappedData = {
      id: (result as any).s_no,
      accountNumber: (result as any).account_number?.toString(),
      names: (result as any).name,
      address: (result as any).address,
      unitsHeld: (result as any).units_held?.toString(),
      rightDue: (result as any).rights_due?.toString(),
      amountPayable: (result as any).amount?.toString(),
      mobile: (result as any).mobile_no,
      emailAddress: (result as any).email,
    };

    res.json({
      // success: true,
      data: mappedData,
    });
  } catch (error: any) {
    console.error("Get record error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching record",
    });
  }
};
