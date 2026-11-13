import prisma from '../config/database.js';

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });

    res.json({
      success: true,
      data: { addresses },
    });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, streetAddress, apartment, city, state, postalCode, country = 'India', isDefault, addressType } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        streetAddress,
        apartment,
        city,
        state,
        postalCode,
        country,
        isDefault: isDefault || false,
        addressType: addressType || 'HOME',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Address added to your address book.',
      data: { address },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const address = await prisma.address.findUnique({ where: { id } });

    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await prisma.address.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Address removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

