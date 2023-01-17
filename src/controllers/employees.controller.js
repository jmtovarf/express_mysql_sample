import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM employee WHERE id=?", [
      req.params.id,
    ]);
    if (result.length <= 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, salary } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO employee (name, salary) VALUES (?, ?)",
      [name, salary]
    );
    res.send({ id: rows.insertId, name, salary });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateEmployee = async (req, res) => {
  const { name, salary } = req.body;
  const { id } = req.params;

  try {
    const [results] = await pool.query(
      "UPDATE employee SET name=IFNULL(?, name), salary=IFNULL(?, salary) WHERE id=?",
      [name, salary, id]
    );

    if (results.affectedRows == 0)
      return res.status(404).json({ message: "Employee not found" });

    const [employee] = await pool.query("SELECT * FROM employee WHERE id=?", [
      id,
    ]);

    res.send(employee[0]);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM employee WHERE id=?", [
      req.params.id,
    ]);
    if (result.affectedRows != 1) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
