const schemesRepository = require("./schemes.repository");
const Notification = require("../notifications/notifications.model");

class SchemesService {
  async getSchemes(filter, user) {
    const { category, department, state, search, status, page, limit } = filter;
    let query = {};

    if (user && ["admin", "official"].includes(user.role)) {
      if (status) {
        query.status = status;
      }
    } else {
      query.status = "approved";
    }

    if (category) query.category = category;
    if (department) query.department = department;
    if (state) {
      if (state.toLowerCase() === "global") {
        query.state = "Global";
      } else {
        query.state = state;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        { description: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
        { benefits: { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
      ];
    }

    const skip = page && limit ? (Number(page) - 1) * Number(limit) : 0;
    const maxLimit = limit ? Math.min(Number(limit), 100) : 25;

    return await schemesRepository.find(query, skip, maxLimit);
  }

  async getSchemeById(id, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    if (scheme.status !== "approved") {
      if (!user || !["admin", "official"].includes(user.role)) {
        throw new Error("Unauthorized to view this scheme");
      }
    }

    return scheme;
  }

  async createScheme(schemeData, userId) {
    return await schemesRepository.create({
      ...schemeData,
      createdBy: userId,
    });
  }

  async updateScheme(id, updateData, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const creatorId = scheme.createdBy?._id || scheme.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin") {
      throw new Error("Unauthorized to edit this scheme");
    }

    if (updateData.updateContent) {
      if (!scheme.updates) scheme.updates = [];
      scheme.updates.push({
        content: updateData.updateContent,
        date: new Date(),
      });
      delete updateData.updateContent;
    }

    return await schemesRepository.findByIdAndUpdate(id, updateData);
  }

  async deleteScheme(id, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) {
      throw new Error("Scheme not found");
    }

    const creatorId = scheme.createdBy?._id || scheme.createdBy;
    if (creatorId.toString() !== user.id && user.role !== "admin") {
      throw new Error("Unauthorized to delete this scheme");
    }

    return await schemesRepository.findByIdAndDelete(id);
  }

  async submitForApproval(id, user) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");
    if (scheme.createdBy.toString() !== user.id && user.role !== "admin") throw new Error("Only the creator can submit this record");
    if (scheme.status !== "draft") throw new Error("Only drafts can be submitted");
    scheme.status = "pending_approval";
    return await schemesRepository.save(scheme);
  }

  async approveScheme(id, approverId) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");
    if (scheme.status !== "pending_approval") throw new Error("Only submitted records can be approved");
    scheme.status = "approved";
    scheme.approvedBy = approverId;
    const saved = await schemesRepository.save(scheme);

    // Send global notification
    await Notification.create({
      userId: null,
      title: "New Public Welfare Scheme Live",
      message: `A new public scheme '${scheme.title}' has been launched under the ${scheme.department} department. Check eligibility parameters!`,
      type: "scheme_update",
    });

    return saved;
  }

  async rejectScheme(id) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");
    if (scheme.status !== "pending_approval") throw new Error("Only submitted records can be rejected");
    scheme.status = "draft";
    return await schemesRepository.save(scheme);
  }

  async archiveScheme(id) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");

    scheme.status = "archived";
    return await schemesRepository.save(scheme);
  }

  async addSchemeUpdate(id, content) {
    const scheme = await schemesRepository.findById(id);
    if (!scheme) throw new Error("Scheme not found");

    scheme.updates.push({ content });
    return await schemesRepository.save(scheme);
  }
}

module.exports = new SchemesService();
