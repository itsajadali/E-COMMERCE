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

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limits = this.queryStr.limits * 1 || 10;
    const skip = (page - 1) * limits;

    this.query = this.query.skip(skip).limit(limits);

    return this;
  }
}

module.exports = APIfeatures;
