body {
    margin: 0;
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
}

header {
    width: 100%;
    background-image: url('https://t3.ftcdn.net/jpg/02/15/25/66/360_F_215256610_D1nzrwWuINTR113WPV6ddsHzBTVoZdrc.jpg');
    background-size: cover;
    background-position: center;
    text-align: center;
    color: white;
    padding: 20px;
    font-size: 24px;
}

main {
    width: 90%;
    max-width: 1200px;
}

.button-container {
    text-align: center;
    margin: 20px 0;
}

.toggle-form-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #4CAF50;
    background-color: white;
    color: #4CAF50;
    transition: transform 0.3s ease;
}

.toggle-form-button:hover {
    transform: scale(1.1);
}

.table-container {
    width: 100%;
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table, th, td {
    border: 1px solid black;
}

th {
    background-color: #e0e0e0;
    font-size: 14px;
}

th, td {
    padding: 10px;
    text-align: left;
    font-size: 12px;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    word-wrap: break-word;
}

td img {
    width: 50px;
    cursor: pointer;
}

td img:hover {
    width: 150px;
    transition: width 0.3s ease;
}

td a {
    color: blue;
    text-decoration: underline;
}

td a:hover {
    color: red;
}


td .tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
}

td .tooltip .tooltiptext {
    visibility: hidden;
    width: 100px;
    background-color: #f9f9f9;
    color: #000;
    text-align: left;
    border-radius: 5px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 50%;
    margin-left: -50px;
    opacity: 0;
    transition: opacity 0.3s;
}

td .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}

.form-container {
    width: 100%;
    display: none; /* 初期表示を非表示に設定 */
}

form {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

label {
    display: block;
    margin-bottom: 10px;
}

input[type="text"],
input[type="tel"],
input[type="email"],
input[type="url"],
input[type="number"],
select,
textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.required::after {
    content: "（入力必須）";
    color: red;
    margin-left: 5px;
}

button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

button[type="button"] {
    background-color: #f44336;
    color: white;
    margin-left: 10px;
}

.disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    padding-top: 60px;
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.map-container {
    margin: 10px 0;
}

#map {
    width: 100%;
    height: 400px;
}

.map-container button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

.map-container button:hover {
    background-color: #45a049;
}
