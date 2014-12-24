# Functional Matrix

An easy-to-use library for working with two-dimensional arrays and matrices.  Most functional and array methods are implemented here, including `each`, `map`, `reduce`, `push`, `pop`, `slice`, and `concat`.  Standard numerical methods, such as matrix multiplication and determinants, are also included, along with some commonly used matrices, such as identity and rotation.

## Usage

### Initializiation
```javascript
  var Matrix = require("functional-matrix");

  // a 2x3 matrix where all elements are "hello".
  var matrix1 = new Matrix(2, 3, "hello");

  // a 3x1 matrix with computed elements.
  var matrix2 = new Matrix(3, 1, function(row, col) {
    return 10*row + 3*col;
  })

  // a matrix from a 2d array.
  var matrix3 = new Matrix([[1, 2], [3, 4]]);

  // A new 2d array from a matrix.
  var arrays = matrix4.to2dArray();
```

### Functional methods

```javascript
  var matrix1 = new Matrix(2, 3, function(i, j) {
    return i + j;
  });
  // 0 1 2
  // 1 2 3

  // Make a new array through `map`.
  var mapped = matrix1.map(function(elem, i, j) {
    return elem * -1;
  });
  //  0 -1 -2
  // -1 -2 -3

  // Reduce all rows into values, creating a 1d array.
  // Initial values can be a single value or an array (1 val for each row).
  var rowReduced = matrix1.reduceRows(function(partial, elem, i, j) {
    return partial + elem
  }, [10, 20]); 
  // [13, 26]
```

### Regular matrix stuff

```javascript
  var matrix = new Matrix(3, 4, Math.random) // 3x4 matrix of random elements

  matrix.set(1, 2, "bananas")
  matrix.get(1, 2); // "bananas"
  matrix.equals(otherMatrix); // boolean
  
  // Numerical methods
  matrix.add(4).add(otherMatrix).times(anotherMatrix).mod(2).determinant()

  // Implementations of standard array methods.
  var slice = matrix.slice(0, 0, 2, 2) // args: startRow, startCol, endRow, endCol
  var newColCount = matrix.pushCol([5, 6, 7]); // modifies matrix in-place
  var row = matrix.popRow(); 
  var larger = matrix.concatVertical(otherMatrix); // sizes must match
  var idx = matrix.indexOf(1) // {row: 0, col: 0}
  
```

## Method List

### Class methods
- new Matrix(height, width, value)
- new Matrix(height, width, fillFunction(row, col))
- new Matrix(arrayOfArrays)
- .Identity(size)
- .Rotation(radians) - *2d rotation matrix for given angle*
- .RotationRadians(radians) - *alias of `Rotation`*
- .RotationDegrees(degrees)

__coming soon__
- .Vector/.VectorHorizontal
- .VectorVertical

### Basics
- .to2dArray()
- .toString()
- .copy()
- .equals(matrix)
- .equalsRow(rowIndex, array)
- .equalsRow(rowIndex, matrix)
- .equalsCol(colIndex, array)
- .equalsCol(colIndex, matrix)
- .size() - *returns an object {rows: x, cols: y};*
- .rows() - *row count*
- .cols() - *col count*
- .withinBounds(rowIndex, colIndex) - *boolean*
- .get(rowIndex, colIndex)
- .getRow(rowIndex)
- .getCol(colIndex)
- .set(rowIndex, colIndex, newValue)
- .setRow(rowIndex, newValue)
- .setRow(rowIndex, arrayOfNewValues)
- .setRow(rowIndex, function(colIndex))
- .setCol(colIndex, newValue)
- .setCol(colIndex, arrayOfNewValues)
- .setCol(colIndex, function(rowIndex))
- .fill(fillFunction(rowIndex, colIndex)) - *sets all values*
- .clear() - *sets all values to undefined*

### Functional Methods
All functional methods by default iterate from left to right, top to bottom.  Vertical versions are also provided, though.

- .map(iterator(value, rowIndex, colIndex, matrix))
- .each(iterator(value, rowIndex, colIndex, matrix))
- .eachHorizontal - *alias of `each`*
- .eachVertical
- .eachRow(iterator(row, rowIndex, matrix)) - *passes each row array to the iterator*
- .eachCol(iterator(col, colIndex, matrix))
- .reduce(iterator(acc, value, rowIndex, colIndex, matrix))
- .reduceHorizontal - *alias of `reduce`*
- .reduceVertical
- .reduceRows(iterator(acc, value, row), initial) - *collapses each row to turn matrix into 1d array*
- .reduceCols(iterator(acc, value, col), initial) - *initial can be a value or an array of values, one per column*

__coming soon__
- Support for currying and partial application!
- Right/bottom each/reduce
- .every()
- .some()
- .zipWith()
- .pluck()
- .sample()
- .shuffle()
- .invoke()

### Numerical methods

- .plus(number)
- .plus(matrix)
- .add - *alias of `plus`*
- .minus(number)
- .minus(matrix)
- .subtract - *alias of `minus`*
- .times(number)
- .times(matrix)
- .multiply - *alias of `times`*
- .mod(number)
- .round(digit) - *rounds all values to the given precision*
- .determinant()
- .rowMultiply(fromIdx, toIdx, multiple)

__coming soon__
- .inverse()
- .upperTriangular()
- .solveSystem(values)
- .eigenvalues()


### Size-changing methods
These work the same as the familiar array methods, except they take/return arrays. Push/pop/shift/unshift are in-place.  Slice/concat/transpose/minor return new matrices.

- .slice(startRow, startCol, endRow, endCol) - *behaves like array slice*
- .submatrix() - *alias of `slice`*
- .pushRow(newRow)
- .pushCol(newCol)
- .unshiftRow(newRow)
- .unshiftCol(newCol)
- .popRow()
- .popCol()
- .shiftRow()
- .shiftCol()
- .concat(matrix)
- .concatHorizontal - *alias of `concat`*
- .concatVertical(matrix)
- .minor(row, col) - *the (row, col) minor of the matrix*
- .transpose()

__coming soon__
- .swapRows()
- .swapCols()

### Query methods

- .contains(elem)
- .indexOf(elem) - *finds the first index; returns {row: x, col: y} or null*
- .indexesOf(elem) - *returns array of all matches*
- .count(elem)
- .replace(elem, newElem) - *returns copy*





