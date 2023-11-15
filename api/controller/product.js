import {db} from "../db.js"

export const getProducts = (req,res) =>{
    
    const q = req.query.cat 
    ? "SELECT p.pname, p.product_id, p.user_id,p.price,p.description,p.prod_id,pp.picture FROM Product p JOIN prod_pic pp ON p.product_id = pp.prod_id WHERE p.prod_id = ?;" 
    : "SELECT p.pname, p.product_id, p.user_id,p.price,p.description,p.prod_id,pp.picture FROM Product p JOIN prod_pic pp ON p.product_id = pp.prod_id LIMIT 3;";

    db.query(q,[req.query.cat],(err,data)=>{
        if(err) return res.send(err);
        //console.log(data[0]);
        // RowDataPacket {
        //     product_id: 'prod202310270900002000',
        //     user_id: '123456789',
        //     price: 9.99,
        //     description: 'Latest iPhone',
        //     prod_id: 'ELC',
        //     picture: 'https://i.postimg.cc/SJvyCMGN/aj.png'
        //   }
        return res.status(200).json(data);
    });


};
export const getProduct = (req,res) =>{
    res.json("from controller")
}
export const addProduct = (req,res) =>{
    res.json("from controller")
}
export const deleteProduct = (req,res) =>{
    res.json("from controller")
}
export const updateProduct = (req,res) =>{
    res.json("from controller")
}