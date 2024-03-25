class APIfeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludesFields = ["page", "sort", "limits", "fields"];

    excludesFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(
      /\b(gte|gt|eq|lt|lte)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  search() {
    // toDo implement search for other collections

    if (this.queryStr.keyword) {
      this.query = this.query.find({
        $or: [
          { title: { $regex: this.queryStr.keyword, $options: "i" } },
          { description: { $regex: this.queryStr.keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  limitsField() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate(documentCount) {
    const page = this.queryStr.page * 1 || 1;
    const limits = this.queryStr.limits * 1 || 10;
    const skip = (page - 1) * limits;

    const endIndex = page * limits; // 2 * 10 = 20; // ! if 20 grater then document count

    const pagination = {};
    pagination.current = page;
    pagination.limit = limits;
    pagination.pages = Math.ceil(documentCount / limits); // (50 / 10) = 5 or 5 / 10 = 0.5 -> 1

    if (endIndex < documentCount) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.previous = page - 1;
    }

    this.query = this.query.skip(skip).limit(limits);
    this.paginationResults = pagination;

    return this;
  }
}

module.exports = APIfeatures;
