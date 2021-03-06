'use strict';

var Matrix = require('./');
var expect = require("chai").expect;


describe("Matrix", function() {

  var ex1, ex2, ex3, ex23, repeats, empty;

  var aliasTest = function(m1, m2) {
    return function() {
      expect(ex3[m2]).to.not.equal(undefined)
      expect(ex3[m1]).to.equal(ex3[m2]);
    }
  };

  var classAliasTest = function(m1, m2) {
    return function() {
      expect(Matrix[m1]).to.equal(Matrix[m2]);
      expect(Matrix[m1]).to.not.equal(undefined);
    }
  };

  beforeEach(function() {
    ex1 = new Matrix(1, 1, "A");
    ex2 = new Matrix(2, 2, function(i, j) {return 1 + 2*i + j;});
    ex3 = new Matrix(3, 3, function(i, j) {return 1 + 3*i + j;});
    ex23 = new Matrix(2, 3, function(i, j) {return 1 + 3*i + j;});
    empty = new Matrix(1, 2);
    repeats = new Matrix([[0, 1, 2], [1, 1, 2]]);
  });

  /* 
    Basic Methods
  */

  describe("#constructor", function() {
    it("builds an empty matrix", function() {
      expect(empty._rows).to.equal(1);
      expect(empty._cols).to.equal(2);
      expect(empty._storage).to.deep.equal([[undefined, undefined]]);
    });

    it("builds a matrix from a constant value", function() {
      expect(ex1._rows).to.equal(1);
      expect(ex1._cols).to.equal(1);
      expect(ex1._storage).to.deep.equal([["A"]]);
    });

    it("builds a matrix from a value-providing function", function() {
      expect(ex23._rows).to.equal(2);
      expect(ex23._cols).to.equal(3);
      expect(ex23._storage).to.deep.equal([[1, 2, 3], [4, 5, 6]]);
    });

    it("builds a matrix from an array of arrays", function() {
      expect(repeats._rows).to.equal(2);
      expect(repeats._cols).to.equal(3);
      expect(repeats._storage).to.deep.equal([[0, 1, 2], [1, 1, 2]]);
    });

    it("resizes input arrays if necessary", function() {
      var input = [[1, 2], [3]]; // second row has only one element.
      var storage = new Matrix(input).to2dArray();
      expect(storage[0]).to.have.length(2);
      expect(storage[1]).to.have.length(2);
    });

    it("throws if passed an array of non-arrays", function() {
      var illegal = function() {
        return new Matrix([[1, 2, 3], 1, [3, 4, 5]]);
      };
      expect(illegal).to.throw("A matrix cannot be constructed from a one-dimensional array");
    });
  });

  describe("#fill", function() {
    it("fills a matrix with undefineds if no function is provided", function() {
      var output = ex2.fill().to2dArray();
      expect(output).to.deep.equal([[undefined, undefined], [undefined, undefined]]);
    });

    it("fills a matrix with an input value if a value is provided", function() {
      var output = ex23.fill(3).to2dArray();
      expect(output).to.deep.equal([[3, 3, 3], [3, 3, 3]]);
    });

    it("fills a matrix with values if a function is provided", function() {
      var output = ex2.fill(function(i, j) {
        return String(i) + String(j);
      }).to2dArray();
      expect(output).to.deep.equal([["00", "01"], ["10", "11"]]);
    });
  });

  describe("#get", function() {
    it("returns the value at an index pair", function() {
      expect(ex23.get(0, 0)).to.equal(1);
      expect(ex23.get(0, 1)).to.equal(2);
      expect(ex23.get(0, 2)).to.equal(3);
      expect(ex23.get(1, 0)).to.equal(4);
      expect(ex23.get(1, 1)).to.equal(5);
      expect(ex23.get(1, 2)).to.equal(6);
    });

    it("returns undefined if the index is out of bounds", function() {
      expect(ex23.get(4, 2)).to.equal(undefined);
    });
  });

  describe("#set", function() {
    it("sets a single element of the matrix and returns the old value", function() {
      var old = ex3.set(1, 1, 10);
      expect(old).to.equal(5);
      expect(ex3.get(1, 1)).to.equal(10);
    });

    it("throws if the index is out of bounds", function() {
      expect(ex23.set.bind(ex23, 2, 1, "A")).to.throw("Row index 2 is out of bounds");
      expect(ex23.set.bind(ex23, -2, 1, "A")).to.throw("Row index -2 is out of bounds");
      expect(ex23.set.bind(ex23, 1, 3, "A")).to.throw("Col index 3 is out of bounds");
      expect(ex23.set.bind(ex23, 1, -2, "A")).to.throw("Col index -2 is out of bounds");
    });
  });

  describe("#to2dArray", function() {
    it("outputs an array of arrays", function() {
      expect(ex1.to2dArray()).to.deep.equal([["A"]]);
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });

    it("modifying the output arrays does not change the matrix", function() {
      var output1 = ex3.to2dArray();
      output1[0][0] = -5; // originally 1.
      expect(ex3.get(0, 0)).to.equal(1);
    });
  });

  describe("#toList", function() {
    it("returns a list of all elements in the matrix", function() {
      expect(ex23.toList()).to.deep.equal([1, 2, 3, 4, 5, 6]);
      expect(repeats.toList()).to.deep.equal([0, 1, 2, 1, 1, 2]);
    });
  });

  describe("#clear", function() {
    it("clears the matrix", function() {
      ex23.clear();
      expect(ex23.get(0, 0)).to.equal(undefined);
      expect(ex23.get(0, 1)).to.equal(undefined);
      expect(ex23.get(0, 2)).to.equal(undefined);
      expect(ex23.get(1, 0)).to.equal(undefined);
      expect(ex23.get(1, 1)).to.equal(undefined);
      expect(ex23.get(1, 2)).to.equal(undefined);
    });
  });

  describe("#copy", function() {
    it("outputs a new matrix with copy", function() {
      var copy = ex3.copy();
      expect(copy).to.not.equal(ex3);
      expect(JSON.stringify(copy)).to.equal(JSON.stringify(ex3));
    });


    it("modifying the copy does not change the original", function() {
      var copy = ex3.copy();
      copy.set(0, 0, -5); // originally 1.
      expect(ex3.get(0, 0)).to.equal(1);
    });

    it("is aliased to #clone", aliasTest("copy", "clone"));
  });

  describe("#equals", function() {
    it("true if matrices have the same values", function() {
      expect(ex2.equals(ex2)).to.equal(true);
      expect(ex3.equals(ex3)).to.equal(true);
      expect(ex2.equals(ex2.copy())).to.equal(true);
    });

    it("false if matrices have any differences", function() {
      expect(ex3.equals(ex2)).to.equal(false);

      var newEx3 = ex3.copy();
      newEx3.set(2, 1, 100);
      expect(newEx3.equals(ex3)).to.equal(false);
    });
  });

  describe("#rows", function() {
    it("returns the number of rows", function() {
      expect(ex23.rows()).to.equal(2);
    });
  });

  describe("#cols", function() {
    it("returns the number of columns", function() {
      expect(ex23.cols()).to.equal(3);
    });
  });

  describe("#size", function() {
    it("returns an object with rows and columns", function() {
      expect(ex23.size()).to.deep.equal({rows: 2, cols: 3});
    });
  });

  describe("withinBounds", function() {
    it("returns whether a given row and column pair is within bounds", function() {
      expect(ex23.withinBounds(0, 0)).to.equal(true);
      expect(ex23.withinBounds(1, 0)).to.equal(true);
      expect(ex23.withinBounds(1, 2)).to.equal(true);
      expect(ex23.withinBounds(-1, 2)).to.equal(false);
      expect(ex23.withinBounds(1, -2)).to.equal(false);
      expect(ex23.withinBounds(1, 3)).to.equal(false);
      expect(ex23.withinBounds(2, 2)).to.equal(false);
    });
  });

  describe("#getRow", function() {
    it("returns a copy of the given row", function() {
      var row = ex3.getRow(1);
      expect(row).to.deep.equal([4, 5, 6]);
    });

    it("modifying the row does not modify the matrix", function() {
      var row = ex3.getRow(1);
      row[0] = "4";
      expect(ex3.getRow(1)).to.deep.equal([4, 5, 6]);
    });
  });

  describe("#getCol", function() {
    it("returns a copy of the given row", function() {
      var row = ex3.getCol(1);
      expect(row).to.deep.equal([2, 5, 8]);
    });

    it("modifying the row does not modify the matrix", function() {
      var row = ex3.getCol(1);
      row[0] = "4";
      expect(ex3.getCol(1)).to.deep.equal([2, 5, 8]);
    });
  });

  describe("#setRow", function() {
    it("sets a row to a single value and returns the old value", function() {
      var output = ex23.setRow(1, 5);
      expect(output).to.deep.equal([4, 5, 6]);
      expect(ex23.to2dArray()).to.deep.equal([[1, 2, 3], [5, 5, 5]]);
    });

    it("sets a row to an array of values and returns the old value", function() {
      var output = ex23.setRow(0, [5, 6, "seven"]);
      expect(output).to.deep.equal([1, 2, 3]);
      expect(ex23.to2dArray()).to.deep.equal([[5, 6, "seven"], [4, 5, 6]]);
    });

    it("sets a row to computed values and returns the old value", function() {
      var output = ex23.setRow(1, function(col) { return col + 2});
      expect(output).to.deep.equal([4, 5, 6]);
      expect(ex23.to2dArray()).to.deep.equal([[1, 2, 3], [2, 3, 4]]);
    });
  });

  describe("#setCol", function() {
    it("sets a col to a single value and returns the old value", function() {
      var output = ex23.setCol(0, 7);
      expect(output).to.deep.equal([1, 4]);
      expect(ex23.to2dArray()).to.deep.equal([[7, 2, 3], [7, 5, 6]]);
    });

    it("sets a col to an array of values and returns the old value", function() {
      var output = ex23.setCol(1, [99, "dos"]);
      expect(output).to.deep.equal([2, 5]);
      expect(ex23.to2dArray()).to.deep.equal([[1, 99, 3], [4, "dos", 6]]);
    });

    it("sets a col to computed values and returns the old value", function() {
      var output = ex23.setCol(2, function(row) { return row + 6});
      expect(output).to.deep.equal([3, 6]);
      expect(ex23.to2dArray()).to.deep.equal([[1, 2, 6], [4, 5, 7]]);
    });
  });

  describe("#equalsRow", function() {
    it("tests if a row is equal to a row of another matrix", function() {
      expect(ex23.equalsRow(0, ex3)).to.equal(true);
      expect(ex23.equalsRow(1, ex3)).to.equal(true);
      expect(ex23.equalsRow(1, repeats)).to.equal(false);
      expect(ex23.equalsRow(1, ex2)).to.equal(false);
    });

    it("tests if a row is equal to an array", function() {
      expect(ex23.equalsRow(1, [4, 5, 6])).to.equal(true);
      expect(ex23.equalsRow(0, [1, 2])).to.equal(false);
      expect(ex23.equalsRow(0, [1, 2, 3, 4])).to.equal(false);
      expect(ex23.equalsRow(0, [1, 3, 3])).to.equal(false);
    });

    it("throws if target is not an array or a matrix", function() {
      expect(ex23.equalsRow.bind(ex23, 1, 4)).to.throw();
      expect(ex23.equalsRow.bind(ex23, 1, "hello")).to.throw();
    });

    it("throws if row is out of bounds on caller or target matrix", function() {
      expect(ex23.equalsRow.bind(ex23, -1, ex3)).to.throw();
      expect(ex23.equalsRow.bind(ex23, 2, ex3)).to.throw();
      expect(ex23.equalsRow.bind(ex3, 2, ex23)).to.throw();
    });
  });

  describe("#equalsCol", function() {

    var other;

    beforeEach(function() {
      other = ex23.concat(new Matrix([[0], [0]]));
    });

    it("tests if a col is equal to a col of another matrix", function() {
      expect(ex23.equalsCol(0, other)).to.equal(true);
      expect(ex23.equalsCol(1, other)).to.equal(true);
      expect(ex23.equalsCol(1, repeats)).to.equal(false);
      expect(ex23.equalsCol(0, ex3)).to.equal(false);
    });

    it("tests if a col is equal to an array", function() {
      expect(ex23.equalsCol(1, [2, 5])).to.equal(true);
      expect(ex23.equalsCol(0, [1])).to.equal(false);
      expect(ex23.equalsCol(0, [1, 4, 7])).to.equal(false);
      expect(ex23.equalsCol(0, [1, 5])).to.equal(false);
    });

    it("throws if target is not an array or a matrix", function() {
      expect(ex23.equalsCol.bind(ex23, 1, 4)).to.throw();
      expect(ex23.equalsCol.bind(ex23, 1, "hello")).to.throw();
    });

    it("throws if col is out of bounds on caller or target matrix", function() {
      expect(ex23.equalsCol.bind(ex23, -1, ex3)).to.throw();
      expect(ex23.equalsCol.bind(ex23, 3, ex3)).to.throw();
      expect(ex23.equalsCol.bind(ex3, 3, ex23)).to.throw();
    });
  });

  /* 
    Functional Programming Methods
  */

  describe("#each", function() {
    it("iterates over elements in row order", function() {
      var results = [];
      ex23.each(function(val, i, j) {
        results.push(String(val) + String(i) + String(j));
      });
      expect(results).to.deep.equal(
        ["100", "201", "302", "410", "511", "612"]
      );
    });

    it("is aliased to #eachHorizontal", aliasTest("each", "eachHorizontal"));
  });

  describe("#eachVertical", function() {
    it("iterates over elements in column order", function() {
      var results = [];
      ex23.eachVertical(function(val, i, j) {
        results.push(String(val) + String(i) + String(j));
      });
      expect(results).to.deep.equal(
        ["100", "410", "201", "511", "302", "612"]
      );
    });
  });

  describe("#eachRow", function() {
    it("iterates over rows", function() {
      var results = [];
      ex23.eachRow(function(row, idx) {
        results.push(String(idx) + Math.max.apply(null, row));
      });
      expect(results).to.deep.equal(
        ["03", "16"]
      );
    });
  });

  describe("#eachCol", function() {
    it("iterates over columns", function() {
      var results = [];
      ex23.eachCol(function(col, idx) {
        results.push(String(idx) + Math.max.apply(null, col));
      });
      expect(results).to.deep.equal(
        ["04", "15", "26"]
      );
    });
  });

  describe("#map", function() {
    it("returns a new matrix of mapped values", function() {
      var expected = [
        [ '100', '201', '302' ],
        [ '410', '511', '612' ]
      ];
      var mapped = ex23.map(function(val, i, j) {
        return String(val) + String(i) + String(j);
      });
      expect(mapped.to2dArray()).to.deep.equal(expected);
    });
  });

  describe("#reduce", function() {
    it("returns a single value from the matrix", function() {
      var expected = "000,100,201,302,410,511,612";
      var reduced = ex23.reduce(function(prev, val, i, j) {
        return prev + "," + String(val) + String(i) + String(j);
      }, "000");
      expect(reduced).to.equal(expected);
    });

    it("is aliased to #reduceHorizontal", aliasTest("reduce", "reduceHorizontal"));
  });

  describe("#reduceVertical", function() {
    it("returns a single value from the matrix", function() {
      var expected = "000,100,410,201,511,302,612";
      var reduced = ex23.reduceVertical(function(prev, val, i, j) {
        return prev + "," + String(val) + String(i) + String(j);
      }, "000");
      expect(reduced).to.equal(expected);
    });
  });

  describe("#reduceRows", function() {
    it("returns a one-dimensional array", function() {
      var expected = [7, 16];
      var reduced = ex23.reduceRows(function(prev, item) {
        return item + prev;
      }, 1);
      expect(reduced).to.deep.equal(expected);
    });

    it("can take an array of starting values", function() {
      var expected = [7, 13];
      var reduced = ex23.reduceRows(function(prev, item) {
        return item + prev;
      }, [1, -2]);
      expect(reduced).to.deep.equal(expected);
    });
  });

  describe("#reduceCols", function() {
    it("returns a one-dimensional array", function() {
      var expected = [6, 8, 10];
      var reduced = ex23.reduceCols(function(prev, item) {
        return item + prev;
      }, 1);
      expect(reduced).to.deep.equal(expected);
    });

    it("can take an array of starting values", function() {
      var expected = [6, 9, 12];
      var reduced = ex23.reduceCols(function(prev, item) {
        return item + prev;
      }, [1, 2, 3]);
      expect(reduced).to.deep.equal(expected);
    });
  });

  describe("#every", function() {
    it("returns the AND of applying test to each element", function() {
      expect(ex23.every(function(x) {return x < 7 && x > 0;})).to.equal(true);
      expect(ex23.every(function(x) {return x < 6 && x > 0;})).to.equal(false);
      expect(ex23.every(function(x, i, j) {return i < 2 && j < 3;})).to.equal(true);
      expect(ex23.every(function(x, i, j) {return i < 3 && j < 2;})).to.equal(false);
    });

    it("is aliased to #all", aliasTest("every", "all"));
  });

  describe("#some", function() {
    it("returns the OR of applying test to each element", function() {
      expect(ex23.some(function(x) {return x < 2;})).to.equal(true);
      expect(ex23.some(function(x) {return x < 1;})).to.equal(false);
      expect(ex23.some(function(x, i, j) {return i > 0 && j > 1;})).to.equal(true);
      expect(ex23.some(function(x, i, j) {return i < 1 && j < 0;})).to.equal(false);
    });

    it("is aliased to #any", aliasTest("some", "any"));
  });

  describe("#pluck", function() {
    it("returns a new matrix with the plucked property", function() {
      var matrix = new Matrix([["a", "ab", "abc"], ["ab", "abc", "abcd"]]);
      expect(matrix.pluck("length").to2dArray()).to.deep.equal([[1, 2, 3], [2, 3, 4]]);
    });
  });

  describe("#invoke", function() {
    it("calls the given method of each element and returns results", function() {
      expect(ex23.invoke("toString").to2dArray()).to.deep.equal([["1", "2", "3"], ["4", "5", "6"]]);
    });
  });

  describe("#shuffle", function() {
    it("changes the order of elements of the array", function() {
      var matrix = new Matrix(10, 10, Math.random.bind(Math));
      var shuffled = matrix.shuffle();
      expect(shuffled.equals(matrix)).to.equal(false);
      var elems1 = matrix.toList().sort();
      var elems2 = shuffled.toList().sort();
      expect(elems1).to.deep.equal(elems2);
    });
  });

  describe("#sample", function() {
    it("returns a single element from the array if no arguments are given", function() {
      var sampled = [];
      for (var i = 0; i < 20; i++) {
        sampled.push(ex3.sample());
      }
      sampled.forEach(function(elem) {
        expect(ex3.contains(elem)).to.equal(true);
      });
      // Make sure it's not always the same item.
      sampled.sort();
      expect(sampled[0]).to.not.equal(sampled[sampled.length - 1]);
    });

    it("returns an array of n distinct elements from the array if n given", function() {
      for (var i = 0; i <= 9; i++) {
        var sampled = ex3.sample(i);
        expect(sampled.length).to.equal(i);
        sampled.forEach(function(elem, i) {
          expect(ex3.contains(elem)).to.equal(true);
          var others = sampled.slice(0, i).concat(sampled.slice(i+1));
          expect(others.indexOf(elem)).to.equal(-1);
        });
      }
    });

    it("throws if you attempt to sample too many or too few elements", function() {
      expect(ex3.sample.bind(ex3, -1)).to.throw();
      expect(ex3.sample.bind(ex3, 10)).to.throw();
    });
  });

  describe("#zipWith", function() {

    it("returns a matrix that results from applying a function to two matrices", function() {
      var zipped = ex23.zipWith(repeats, function(elem1, elem2, i, j) {
        return elem1 + elem2 + i + j;
      });
      expect(zipped.to2dArray()).to.deep.equal([[1, 4, 7], [6, 8, 11]]);
    });

    it("throws if first argument is not a matrix", function() {
      expect(ex23.zipWith.bind(ex23, "not a matrix", function() {})).to.throw();
    });

    it("throws if matrices are not the same size", function() {
      expect(ex23.zipWith.bind(ex23, ex2, function() {})).to.throw();
      expect(ex23.zipWith.bind(ex23, ex3, function() {})).to.throw();
    });
  });


  /* 
    Size-Changing Methods
  */

  describe("#submatrix", function() {

    it("returns parts of a matrix", function() {
      var sub1 = ex23.submatrix(0, 0, 1, 2);
      var sub2 = ex3.submatrix(-2, -3, -1, -1);
      var sub3 = ex3.submatrix(1, 1);
      expect(sub1.to2dArray()).to.deep.equal([[1, 2]]);
      expect(sub2.to2dArray()).to.deep.equal([[4, 5]]);
      expect(sub3.to2dArray()).to.deep.equal([[5, 6], [8, 9]]);
    });

    it("is aliased to #slice", aliasTest("slice", "submatrix"));

  });

  describe("#pushRow", function() {
    it("adds a new row to the bottom of the matrix", function() {
      var newRow = [5, 6];
      ex2.pushRow(newRow);
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4], [5, 6]]);
    });

    it("modifying the row does not modify the matrix", function() {
      var newRow = [5, 6];
      ex2.pushRow(newRow);
      newRow[0] = 1000;
      expect(ex2.get(2, 0)).to.equal(5);
    });

    it("pushing a row of incorrect length throws", function() {
      expect(ex2.pushRow.bind(ex2, [7])).to.throw("Cannot push a row of width 1 onto a matrix of width 2");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });

    it("pushing a non-array throws", function() {
      expect(ex2.pushRow.bind(ex2, {length: 1})).to.throw("Cannot push a non-array onto a matrix");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });
  });

  describe("#pushCol", function() {
    it("adds a new column to the right of the matrix", function() {
      var newCol = [10, 11];
      ex2.pushCol(newCol);
      expect(ex2.to2dArray()).to.deep.equal([[1, 2, 10], [3, 4, 11]]);
    });

    it("modifying the column does not modify the matrix", function() {
      var newCol = [10, 11];
      ex2.pushCol(newCol);
      newCol[0] = 1000;
      expect(ex2.get(0, 2)).to.equal(10);
    });

    it("pushing a column of incorrect length throws", function() {
      expect(ex2.pushCol.bind(ex2, [7])).to.throw("Cannot push a col of height 1 onto a matrix of height 2");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });

    it("pushing a non-array throws", function() {
      expect(ex2.pushCol.bind(ex2, {length: 1})).to.throw("Cannot push a non-array onto a matrix");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });
  });

  describe("#unshiftRow", function() {
    it("adds a new row to the top of the matrix", function() {
      var newRow = [5, 6];
      ex2.unshiftRow(newRow);
      expect(ex2.to2dArray()).to.deep.equal([[5, 6], [1, 2], [3, 4]]);
    });

    it("modifying the row does not modify the matrix", function() {
      var newRow = [5, 6];
      ex2.unshiftRow(newRow);
      newRow[0] = 1000;
      expect(ex2.get(0, 0)).to.equal(5);
    });

    it("unshifing a row of incorrect length throws", function() {
      expect(ex2.unshiftRow.bind(ex2, [7])).to.throw("Cannot unshift a row of width 1 onto a matrix of width 2");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });

    it("unshifing a non-array throws", function() {
      expect(ex2.unshiftRow.bind(ex2, {length: 1})).to.throw("Cannot unshift a non-array onto a matrix");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });
  });

  describe("#unshiftCol", function() {
    it("adds a new column to the left of the matrix", function() {
      var newCol = [10, 11];
      ex2.unshiftCol(newCol);
      expect(ex2.to2dArray()).to.deep.equal([[10, 1, 2], [11, 3, 4]]);
    });

    it("modifying the column does not modify the matrix", function() {
      var newCol = [10, 11];
      ex2.unshiftCol(newCol);
      newCol[0] = 1000;
      expect(ex2.get(0, 0)).to.equal(10);
    });

    it("unshifing a column of incorrect length throws", function() {
      expect(ex2.unshiftCol.bind(ex2, [7])).to.throw("Cannot unshift a col of height 1 onto a matrix of height 2");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });

    it("unshifing a non-array throws", function() {
      expect(ex2.unshiftCol.bind(ex2, {length: 1})).to.throw("Cannot unshift a non-array onto a matrix");
      expect(ex2.to2dArray()).to.deep.equal([[1, 2], [3, 4]]);
    });
  });

  describe("#popRow", function() {
    it("removes a row from the bottom of the matrix", function() {
      var result = ex3.popRow();
      expect(result).to.deep.equal([7, 8, 9]);
      expect(ex3.to2dArray()).to.deep.equal([[1, 2, 3], [4, 5, 6]]);
      expect(ex3.rows()).to.equal(2);
    });
  });

  describe("#popCol", function() {
    it("removes a column from the right of the matrix", function() {
      var result = ex3.popCol();
      expect(result).to.deep.equal([3, 6, 9]);
      expect(ex3.to2dArray()).to.deep.equal([[1, 2], [4, 5], [7, 8]]);
      expect(ex3.cols()).to.equal(2);
    });
  });

  describe("#shiftRow", function() {
    it("removes a row from the top of the matrix", function() {
      var result = ex3.shiftRow();
      expect(result).to.deep.equal([1, 2, 3]);
      expect(ex3.to2dArray()).to.deep.equal([[4, 5, 6], [7, 8, 9]]);
      expect(ex3.rows()).to.equal(2);
    });
  });

  describe("#shiftCol", function() {
    it("removes a column from the left of the matrix", function() {
      var result = ex3.shiftCol();
      expect(result).to.deep.equal([1, 4, 7]);
      expect(ex3.to2dArray()).to.deep.equal([[2, 3], [5, 6], [8, 9]]);
      expect(ex3.cols()).to.equal(2);
    });
  });

  describe("#concat", function() {
    it("combines two matrices with the same row count", function() {
      var result = ex2.concat(ex23);
      expect(result.to2dArray()).to.deep.equal([
        [1, 2, 1, 2, 3],
        [3, 4, 4, 5, 6]
      ]);
    });

    it("throws if matrices do not have the same row count", function() {
      expect(ex3.concat.bind(ex3, ex23)).to.throw("Cannot concat a matrix with 3 rows to a matrix with 2 rows");
    });

    it("throws if argument is not a matrix", function() {
      expect(ex3.concat.bind(ex3, {_rows: 2})).to.throw("Cannot concat a matrix to a non-matrix");
    });

    it("is aliased to #concatHorizontal", aliasTest("concat", "concatHorizontal"));
  });

  describe("#concatVertical", function() {
    it("combines two matrices with the same col count", function() {
      var result = ex3.concatVertical(ex23);
      expect(result.to2dArray()).to.deep.equal([
        [1, 2, 3], 
        [4, 5, 6],
        [7, 8, 9],
        [1, 2, 3], 
        [4, 5, 6]
      ]);
    });

    it("throws if matrices do not have the same column count", function() {
      expect(ex2.concatVertical.bind(ex2, ex23)).to.throw("Cannot concatVertical a matrix with 2 cols to a matrix with 3 cols");
    });

    it("throws if argument is not a matrix", function() {
      expect(ex3.concatVertical.bind(ex3, {_cols: 3})).to.throw("Cannot concatVertical a matrix to a non-matrix");
    });
  });

  describe("#minor", function() {
    it("returns a matrix with a single row and column removed", function() {
      var minor01 = [[4, 6], [7, 9]];
      var minor20 = [[2, 3], [5, 6]];
      expect(ex3.minor(0, 1).to2dArray()).to.deep.equal(minor01);
      expect(ex3.minor(2, 0).to2dArray()).to.deep.equal(minor20);
    });

    it("throws if index is out of bounds", function() {
      expect(ex23.minor.bind(ex23, -1, 1)).to.throw("Row index -1 is out of bounds");
      expect(ex23.minor.bind(ex23, 2, 2)).to.throw("Row index 2 is out of bounds");
      expect(ex23.minor.bind(ex23, 1, -1)).to.throw("Col index -1 is out of bounds");
      expect(ex23.minor.bind(ex23, 1, 3)).to.throw("Col index 3 is out of bounds");
    });
  });

  describe("#transpose", function() {
    it("returns the transpose of a matrix", function() {
      var transpose23 = [[1, 4], [2, 5], [3, 6]];
      var transpose3 = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];
      expect(ex23.transpose().to2dArray()).to.deep.equal(transpose23);
      expect(ex3.transpose().to2dArray()).to.deep.equal(transpose3);
    });
  });

  describe("#swapRows", function() {
    it("switches the position of two rows", function() {
      expect(ex23.swapRows(0, 1).to2dArray()).to.deep.equal([[4, 5, 6], [1, 2, 3]]);
      expect(ex3.swapRows(0, 1).to2dArray()).to.deep.equal([[4, 5, 6], [1, 2, 3], [7, 8, 9]]);
    });
  });

  describe("#swapCols", function() {
    it("switches the position of two cols", function() {
      expect(ex23.swapCols(0, 1).to2dArray()).to.deep.equal([[2, 1, 3], [5, 4, 6]]);
      expect(ex3.swapCols(0, 1).to2dArray()).to.deep.equal([[2, 1, 3], [5, 4, 6], [8, 7, 9]]);
    });
  });

  describe("#rotateCW", function() {
    it("rotates a matrix 90 degrees clockwise", function() {
      expect(ex23.rotateCW().to2dArray()).to.deep.equal([[4, 1], [5, 2], [6, 3]]);
      expect(ex3.rotateCW().to2dArray()).to.deep.equal([[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
    });

    it("four rotations returns the original matrix", function() {
      var rotate4 = ex23.rotateCW().rotateCW().rotateCW().rotateCW();
      expect(rotate4.equals(ex23)).to.equal(true);
    });
  });

  describe("#rotateCCW", function() {
    it("rotates a matrix 90 degrees counterclockwise", function() {
      expect(ex23.rotateCCW().to2dArray()).to.deep.equal([[3, 6], [2, 5], [1, 4]]);
      expect(ex3.rotateCCW().to2dArray()).to.deep.equal([[3, 6, 9], [2, 5, 8], [1, 4, 7]]);
    });

    it("four rotations returns the original matrix", function() {
      var rotate4 = ex23.rotateCCW().rotateCCW().rotateCCW().rotateCCW();
      expect(rotate4.equals(ex23)).to.equal(true);
    });
  });

  describe("#flipHorizontal", function() {
    it("flips a matrix horizontally", function() {
      expect(ex23.flipHorizontal().to2dArray()).to.deep.equal([[3, 2, 1], [6, 5, 4]]);
      expect(ex3.flipHorizontal().to2dArray()).to.deep.equal([[3, 2, 1], [6, 5, 4], [9, 8, 7]]);
    });

    it("two flips returns the original matrix", function() {
      var flip2 = ex23.flipHorizontal().flipHorizontal();
      expect(flip2.equals(ex23)).to.equal(true);
    });
  });

  describe("#flipVertical", function() {
    it("flips a matrix vertically", function() {
      expect(ex23.flipVertical().to2dArray()).to.deep.equal([[4, 5, 6], [1, 2, 3]]);
      expect(ex3.flipVertical().to2dArray()).to.deep.equal([[7, 8, 9], [4, 5, 6], [1, 2, 3]]);
    });

    it("two flips returns the original matrix", function() {
      var flip2 = ex23.flipVertical().flipVertical();
      expect(flip2.equals(ex23)).to.equal(true);
    });
  });

  /*
    Query Methods
  */

  describe("#contains", function() {
    it("tests for the presence of an element", function() {
      expect(ex23.contains(1)).to.equal(true);
      expect(ex23.contains(3)).to.equal(true);
      expect(ex23.contains(6)).to.equal(true);
      expect(ex23.contains(7)).to.equal(false);
      expect(ex23.contains("1")).to.equal(false);
    });
  });

  describe("#indexOf", function() {
    it("finds the first location of an element", function() {
      expect(ex3.indexOf(8)).to.deep.equal({row: 2, col: 1});
      expect(repeats.indexOf(1)).to.deep.equal({row: 0, col: 1});
    });

    it("returns null if the element is not found", function() {
      expect(ex3.indexOf("1")).to.equal(null);
    });
  });

  describe("#indexesOf", function() {
    it("finds all locations of an element", function() {
      expect(ex3.indexesOf(8)).to.deep.equal([{row: 2, col: 1}]);
      expect(repeats.indexesOf(1)).to.deep.equal([{row: 0, col: 1}, {row: 1, col: 0}, {row: 1, col: 1}]);
      expect(ex3.indexesOf("1")).to.deep.equal([]);
    });
  });

  describe("#count", function() {
    it("returns the number of occurances of an element", function() {
      expect(repeats.count(1)).to.equal(3);
      expect(ex3.count("1")).to.equal(0);
    });
  });

  describe("#replace", function() {
    it("returns a new matrix with all instances of the value replaced", function() {
      var replaced = repeats.replace(1, "a");
      expect(replaced).to.not.equal(repeats);
      expect(replaced.to2dArray()).to.deep.equal([
        [0, "a", 2],
        ["a", "a", 2]
      ]);
    });

    it("doesn't modify the matrix", function() {
      repeats.replace(1, "a");
      expect(repeats.to2dArray()).to.deep.equal([
        [0, 1, 2],
        [1, 1, 2]
      ]);
    });    
  });

  /*
    Numerical Methods
  */

  describe("#plus", function() {

    it("adds a number to a matrix", function() {
      var result = ex23.plus(1);
      expect(result).to.not.equal(ex23);
      expect(result.to2dArray()).to.deep.equal([[2, 3, 4], [5, 6, 7]]);
    });

    it("adds a string to a matrix", function() {
      var result = ex23.plus("0");
      expect(result).to.not.equal(ex23);
      expect(result.to2dArray()).to.deep.equal([["10", "20", "30"], ["40", "50", "60"]]);
    });

    it("adds two matrices", function() {
      var result = ex23.plus(ex23.plus(1));
      expect(result.to2dArray()).to.deep.equal([[3, 5, 7], [9, 11, 13]]);
    });

    it("throws if two matrices are not the same size", function() {
      expect(ex23.plus.bind(ex1, ex2)).to.throw("Cannot add a matrix with 1 rows to a matrix with 2 rows");
      expect(ex23.plus.bind(ex23, ex3)).to.throw("Cannot add a matrix with 2 rows to a matrix with 3 rows");
    });

    it("throws if another value type is passed", function() {
      expect(ex2.plus.bind(ex2, null)).to.throw("Cannot add a matrix to null");
    });

    it("is aliased to #add", aliasTest("plus", "add"));
  });

  describe("#times", function() {
    
    it("multiplies a number to a matrix", function() {
      var result = ex23.times(2);
      expect(result).to.not.equal(ex23);
      expect(result.to2dArray()).to.deep.equal([[2, 4, 6], [8, 10, 12]]);
    });

    it("multiplies two matrices", function() {
      var result1 = ex2.times(ex23).to2dArray();
      var result2 = ex23.times(ex3).to2dArray();
      var expected1 = [[ 9, 12, 15 ], [ 19, 26, 33 ]];
      var expected2 = [[ 30, 36, 42 ], [ 66, 81, 96 ]];
      expect(result1).to.deep.equal(expected1);
      expect(result2).to.deep.equal(expected2);
    });

    it("throws if matrix dimensions are not compatible", function() {
      expect(ex23.times.bind(ex23, ex2)).to.throw("Cannot multiply a matrix of 3 cols with a matrix of 2 rows");
      expect(ex3.times.bind(ex3, ex23)).to.throw("Cannot multiply a matrix of 3 cols with a matrix of 2 rows");
    });

    it("throws if another value type is passed", function() {
      expect(ex2.times.bind(ex2, "1")).to.throw("Cannot multiply a matrix with 1");
      expect(ex2.times.bind(ex2, null)).to.throw("Cannot multiply a matrix with null");
    });

    it("is aliased to #multiply", aliasTest("times", "multiply"));
  });

  describe("#minus", function() {
    it("subtracts a number from a matrix", function() {
      var result = ex23.minus(1);
      expect(result.to2dArray()).to.deep.equal([[0, 1, 2], [3, 4, 5]]);
    });

    it("subtracts a matrix from a matrix", function() {
      var result = ex23.minus(repeats);
      expect(result.to2dArray()).to.deep.equal([[1, 1, 1], [3, 4, 4]]);
    });

    it("throws if two matrices are not the same size", function() {
      expect(ex23.minus.bind(ex1, ex2)).to.throw("Cannot subtract a matrix with 2 rows from a matrix with 1 rows");
      expect(ex23.minus.bind(ex23, ex3)).to.throw("Cannot subtract a matrix with 3 rows from a matrix with 2 rows");
    });

    it("throws if another value type is passed", function() {
      expect(ex2.minus.bind(ex2, "asdf")).to.throw("Cannot subtract asdf from a matrix");
      expect(ex2.minus.bind(ex2, null)).to.throw("Cannot subtract null from a matrix");
    });

    it("is aliased to #subtract", aliasTest("subtract", "minus"));
  });

  describe("#mod", function() {
    it("returns a matrix modulo a number", function() {
      expect(ex23.mod(2).to2dArray()).to.deep.equal([[1, 0, 1], [0, 1, 0]]);
      expect(ex3.mod(4).to2dArray()).to.deep.equal([[1, 2, 3], [0, 1, 2], [3, 0, 1]]);
    });
  });

  describe("#identity", function() {
    it("returns the identity matrix for a given size", function() {
      expect(Matrix.identity(1).to2dArray()).to.deep.equal([[1]]);
      expect(Matrix.identity(2).to2dArray()).to.deep.equal([[1, 0], [0, 1]]);
      expect(Matrix.identity(3).to2dArray()).to.deep.equal([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    });

    it("throws for invalid sizes", function() {
      var msg = "Invalid size for identity matrix";
      expect(Matrix.identity.bind(Matrix)).to.throw(msg);
      expect(Matrix.identity.bind(Matrix, -1)).to.throw(msg);
      expect(Matrix.identity.bind(Matrix, 0)).to.throw(msg);
      expect(Matrix.identity.bind(Matrix, null)).to.throw(msg);
      expect(Matrix.identity.bind(Matrix, "asdf")).to.throw(msg);
    });
  });

  describe("#determinant", function() {
    it("returns the determinant of a matrix", function() {
      expect(ex2.determinant()).to.equal(-2);
      expect(ex3.determinant()).to.equal(0);

      ex23.pushRow([-1, -4, 1]);
      expect(ex23.determinant()).to.equal(-24);
    });

    it("throws if matrix is not square", function() {
      expect(ex23.determinant.bind(ex23)).to.throw("A matrix must be square to have a determinant");
    });
  });

  describe("#round", function() {
    it("rounds a matrix to arbitrary precision", function() {
      var m = new Matrix([[Math.PI, Math.sqrt(2)], [Math.sqrt(1000), 0]]);
      expect(m.round().to2dArray()).to.deep.equal([[3, 1], [32, 0]]);
      expect(m.round(2).to2dArray()).to.deep.equal([[3.14, 1.41], [31.62, 0]]);
      expect(m.round(-1).to2dArray()).to.deep.equal([[0, 0], [30, 0]]);
    });
  });

  describe("#rotation", function() {

    it("creates a rotation matrix for the given angle", function() {
      var rot180 = Matrix.rotation(Math.PI/2);
      var rot60 = Matrix.rotation(-1*Math.PI/3);

      expect(rot180.round(2).to2dArray()).to.deep.equal([[0, -1], [1, 0]]);
      expect(rot60.round(2).to2dArray()).to.deep.equal([[0.5, 0.87], [-0.87, 0.5]]);
    });

    it("is aliased to #rotationRadians", classAliasTest("rotation", "rotationRadians"));
  });

  describe("#rotationDegrees", function() {
    it("creates a rotation matrix", function() {
      expect(Matrix.rotationDegrees(90).equals(Matrix.rotation(Math.PI/2))).to.equal(true);
      expect(Matrix.rotationDegrees(-60).equals(Matrix.rotation(-1*Math.PI/3))).to.equal(true);
    });
  }); 

  describe("#vector", function() {
    it("creates a vector with given array", function() {
      expect(Matrix.vector([1, 2, 3, 4]).to2dArray()).to.deep.equal([[1, 2, 3, 4]]);
    });

    it("is aliased to #vectorHorizontal", classAliasTest("vector", "vectorHorizontal"));
  });

  describe("#vectorVertical", function() {
    it("creates a vertical vector with given array", function() {
      expect(Matrix.vectorVertical([1, 2, 3, 4]).to2dArray()).to.deep.equal([[1], [2], [3], [4]]);
    });
  });

});