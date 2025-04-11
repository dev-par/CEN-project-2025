import express from 'express';
import db from '../db/connect.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

const clubs = db.collection('clubs');

// create a new club
router.post('/', async (req, res) => {
    const { name, description, major, chillMeter, socials } = req.body;

    if (!name || !major) {
        return res.status(400).json({ message: 'Name and major are required' });
    }

    const newClub = {
        name,
        description,
        major,
        chillMeter,
        socials,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        const result = await clubs.insertOne(newClub);

        res.status(201).json({
            message: "Club created successfully",
            id: result.insertedId
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// get all clubs or filter by major
router.get('/', async (req, res) => {
    const { major, sortBy } = req.query;
    let sortOptions = {};

    if (sortBy === 'recentlyUpdated') {
        sortOptions = { updatedAt: -1 };
    }

    try {
        const query = major ? { major } : {};
        const result = await clubs.find(query).sort(sortOptions).toArray();

        if (result.length === 0) {
            return res.status(200).json({ message: "No clubs found", data: [] });
        }

        res.status(200).json(result);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// update club by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, major, chillMeter, socials } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    try {
        const updateFields = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (major) updateFields.major = major;
        if (chillMeter) updateFields.chillMeter = chillMeter;
        if (socials) updateFields.socials = socials;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        updateFields.updatedAt = new Date();
        const result = await clubs.updateOne(
            {_id: new ObjectId(id)}, 
            { $set: updateFields }    
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Club not found" });
        }

        res.status(200).json({ 
            message: "Club updated successfully",
            id
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// delete a club by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const result = await clubs.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Club not found" });
        }

        res.status(200).json({ 
            message: 'Club deleted successfully',
            id
         });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;