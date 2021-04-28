package ir.ac.sbu.evaluation.dto.user.master;

import ir.ac.sbu.evaluation.model.user.Master;
import javax.validation.constraints.NotNull;
import lombok.Builder;

public class MasterRegisterDto {

    @NotNull
    private MasterDto master;

    @NotNull
    private long facultyId;

    public MasterRegisterDto() {
    }

    @Builder
    public MasterRegisterDto(MasterDto master, long facultyId) {
        this.master = master;
        this.facultyId = facultyId;
    }

    public static MasterRegisterDto from(Master master, long facultyId) {
        return builder()
                .master(MasterDto.from(master))
                .facultyId(facultyId)
                .build();
    }

    public MasterDto getMaster() {
        return master;
    }

    public void setMaster(MasterDto master) {
        this.master = master;
    }

    public long getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(long facultyId) {
        this.facultyId = facultyId;
    }
}
